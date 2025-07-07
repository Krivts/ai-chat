export async function handler(event) {
  const { prompt } = JSON.parse(event.body);

  const apiKey = process.env.OPENROUTER_KEY; // ✅ Берём из переменной окружения

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is missing" }),
    };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`, // ← теперь ключ скрыт
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "Ты маркетолог. Дай краткую характеристику клиента по описанию." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: data.choices?.[0]?.message?.content || "Нет ответа"
    })
  };
}