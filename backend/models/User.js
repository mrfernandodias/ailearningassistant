/**
 * ============================================
 * 👤 USER MODEL
 * ============================================
 *
 * Mongoose model for user authentication and profile management.
 * Handles password hashing and validation at database level.
 *
 * Laravel Equivalent: app/Models/User.php (Eloquent Model)
 */

import bcrypt from 'bcryptjs'; // Password hashing library
import mongoose from 'mongoose'; // MongoDB ODM

/**
 * User Schema Definition
 * Defines structure and validation rules for user documents
 * Laravel: Similar to migration + $fillable + $casts
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Username Field
     * - Unique identifier for user (besides email)
     * - Trimmed to remove leading/trailing spaces
     * - Minimum 3 characters
     * - Creates unique index in MongoDB
     */
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true, // Creates unique index (prevents duplicates)
      trim: true, // Removes whitespace from both ends
      minlength: [3, 'Username must be at least 3 characters long'],
    },

    /**
     * Email Field
     * - Primary authentication identifier
     * - Converted to lowercase for consistency
     * - Validated with regex pattern
     * - Creates unique index in MongoDB
     * Laravel: 'email' => 'required|email|unique:users'
     */
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // Prevents duplicate emails
      lowercase: true, // Auto-converts to lowercase (User@Email.com → user@email.com)
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'], // Email format validation
    },

    /**
     * Password Field
     * - Hashed automatically before saving (see pre('save') hook below)
     * - select: false means password is NOT returned in queries by default
     * - Must explicitly select it: User.findById(id).select('+password')
     * Laravel: protected $hidden = ['password']
     */
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in query results for security
    },

    /**
     * Profile Image Field
     * - Optional field for user avatar/profile picture
     * - Can store URL or file path
     * - Defaults to null if not provided
     */
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    /**
     * Schema Options
     * timestamps: true automatically adds:
     * - createdAt: Date when document was created
     * - updatedAt: Date when document was last modified
     *
     * Laravel: $timestamps = true (default in Eloquent)
     */
    timestamps: true,
  },
);

// ==========================================
// 🔒 MIDDLEWARE - Password Hashing
// ==========================================

/**
 * Pre-save Hook: Hash password before saving to database
 *
 * Runs automatically BEFORE document.save() executes
 * Only hashes if password is new or modified (not on other field updates)
 *
 * Flow:
 * 1. Check if password was modified (new user or password change)
 * 2. Generate salt (random string added to password before hashing)
 * 3. Hash password + salt using bcrypt
 * 4. Replace plain text password with hashed version
 *
 * Laravel Equivalent:
 * protected static function boot() {
 *     parent::boot();
 *     static::creating(function ($user) {
 *         $user->password = Hash::make($user->password);
 *     });
 * }
 *
 * @param {Function} next - Callback to continue middleware chain
 */
userSchema.pre('save', async function (next) {
  // Skip hashing if password wasn't changed (e.g. updating username only)
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt: random data added to password before hashing
  // 10 rounds = good balance between security and performance
  // More rounds = more secure but slower
  const salt = await bcrypt.genSalt(10);

  // Hash password with salt
  // Original: "mypassword123"
  // Hashed:   "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// 🔑 INSTANCE METHODS
// ==========================================

/**
 * Compare entered password with hashed password in database
 *
 * Used during login to verify user credentials
 * bcrypt.compare() hashes the entered password and compares with stored hash
 *
 * Usage in controller:
 * const user = await User.findOne({ email }).select('+password');
 * const isMatch = await user.matchPassword(enteredPassword);
 * if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
 *
 * Laravel Equivalent:
 * Hash::check($request->password, $user->password)
 *
 * @param {String} enteredPassword - Plain text password from login form
 * @returns {Promise<Boolean>} - true if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 📦 MODEL EXPORT
// ==========================================

/**
 * Create and export User model
 *
 * This registers the model with Mongoose and makes it available
 * for CRUD operations throughout the application
 *
 * Usage:
 * import User from './models/User.js';
 * const user = await User.findById(id);
 * await user.save();
 *
 * Laravel Equivalent: User::find($id)
 */
const User = mongoose.model('User', userSchema);

export default User;
