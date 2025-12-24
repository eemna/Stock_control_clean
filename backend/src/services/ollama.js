import fetch from "node-fetch";

export async function askLLM(prompt) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma3:1b",
      prompt,
      stream: false
    })
  });

  const data = await res.json();
  return data.response;
}
