export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    const userQuestion = body.question;
    const systemInst = body.systemInstruction;

    // 🔑 DÁN GROQ API KEY (BẮT ĐẦU BẰNG gsk_...) CỦA THẦY VÀO ĐÂY:
    const GROQ_API_KEY = "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";

    // Gọi đến máy chủ Groq AI (Mô hình Llama-3.3-70b siêu nhanh và thông minh)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInst },
          { role: "user", content: userQuestion }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!groqResponse.ok) {
      const errData = await groqResponse.json();
      return new Response(JSON.stringify({ error: errData }), {
        status: groqResponse.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await groqResponse.json();
    
    // Chuẩn hóa định dạng trả về tương thích với giao diện tro-ly-ai.html
    const aiText = data.choices?.[0]?.message?.content || "Không nhận được phản hồi từ máy chủ AI.";

    const formattedResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: aiText }]
          }
        }
      ]
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
