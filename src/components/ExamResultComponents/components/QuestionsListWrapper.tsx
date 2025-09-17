import { useState } from "react";
import { QuestionWithOptions } from "../../../types/exam";
import { useQuestions } from "../../../hooks/useQuestions";
import { QuestionsList } from "./QuestionsList";
import { QuestionForm } from "./QuestionForm";
import { BulkUpload } from "./BulkUpload";

export const QuestionsListWrapper = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithOptions | undefined>();
  const { createQuestion, updateQuestion } = useQuestions();

  const handleEditQuestion = (question: QuestionWithOptions) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setShowQuestionForm(true);
  };

  const handleBulkUpload = () => {
    setShowBulkUpload(true);
  };

  const handleFormSubmit = async (questionData: any, options: any[]) => {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, questionData, options);
    } else {
      await createQuestion(questionData, options);
    }
  };

  const handleCloseForm = () => {
    setShowQuestionForm(false);
    setShowBulkUpload(false);
    setEditingQuestion(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <QuestionsList
        onEditQuestion={handleEditQuestion}
        onAddQuestion={handleAddQuestion}
        onBulkUpload={handleBulkUpload}
      />

      <QuestionForm
        isOpen={showQuestionForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingQuestion={editingQuestion ? {
          ...editingQuestion,
          options: editingQuestion.options.map(option => ({
            ...option,
            question_id: option?.question_id ?? editingQuestion.id
          }))
        } : undefined}
      />

      <BulkUpload
        isOpen={showBulkUpload}
        onClose={handleCloseForm}
        onSuccess={() => {
          setShowBulkUpload(false);
          // Optionally refresh data or show success toast
        }}
      />
    </div>
  );
};
