export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    const userQuestion = body.question;
    const systemInst = body.systemInstruction;

    // Chuỗi token AQ của thầy
    const OAUTH_TOKEN = "AQ.Ab8RN6I7iXrCMAYMUw_t89WTk16zyZb06AsZnAK3YPjatcNtdg";

    // Gọi lên máy chủ Google Gemini từ phía Server-side (vượt lỗi CORS)
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OAUTH_TOKEN.trim()}`
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuestion }] }],
        systemInstruction: { parts: [{ text: systemInst }] }
      })
    });

    const data = await geminiResponse.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
