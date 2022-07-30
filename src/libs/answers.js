export const getAnswerColor = answer => {
    const answerLabel = answer.name && answer.name.en || '';

    if (answerLabel.toLowerCase() == 'no') {
      return 'red';
    }
  
    if (answerLabel.toLowerCase() == 'yes') {
      return 'green';
    }
  
    return 'inherit';
  }