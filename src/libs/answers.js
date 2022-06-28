export const getAnswerColor = answer => {
    if (answer.toLowerCase() == 'no') {
      return 'red';
    }
  
    if (answer.toLowerCase() == 'yes') {
      return 'green';
    }
  
    return 'inherit';
  }