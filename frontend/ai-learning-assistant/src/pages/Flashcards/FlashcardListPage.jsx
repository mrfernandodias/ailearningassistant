import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import flashcardService from '../../services/flashcardService';
import FlashcardSetCard from './FlashcardSetCard';

const FlashcardListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();

        console.log('fetchFlashcardSets___', response.data);
        setFlashcardSets(response.data);
      } catch (error) {
        toast.error('Error to fetch flashcard sets');
        console.error('Error to fetch flashcard sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets found"
          description="You haven't generated any flashcard sets yet. Go to a document to create your first set"
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashcardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="All Flashcard Sets" />
      {renderContent()}
    </div>
  );
};

export default FlashcardListPage;
