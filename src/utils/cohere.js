export const generateDietPlan = async (user) => {
    const prompt = `Create a personalized daily diet plan for this person:
    - Name: ${user.firstName} ${user.lastName}
    - Age: ${user.age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Fitness Goal: ${user.goal}
    
  Include 3 meals and a snack recommendation. Use bullet points and keep it concise.`;
  
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 400,
          temperature: 0.8,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE',
        }),
      });
  
      const data = await response.json();
      return data.generations?.[0]?.text?.trim() || '❗No diet plan generated.';
    } catch (error) {
      console.error('Cohere API error:', error);
      return '⚠️ Error generating diet plan.';
    }
  };
  