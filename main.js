async function translateToJapanese(text) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=en|ja";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("翻訳 API の呼び出しに失敗しました");
  }

  const data = await res.json();
  return data.responseData.translatedText;
}

const fetchButton = document.getElementById("fetchButton");
const statusEl = document.getElementById("status");
const resultCard = document.getElementById("resultCard");

const adviceTitle = document.getElementById("adviceTitle");
const adviceText = document.getElementById("adviceText");
const adviceId = document.getElementById("adviceId");

if (fetchButton && statusEl && resultCard && adviceTitle && adviceText && adviceId) {
  fetchButton.addEventListener("click", async () => {
    statusEl.textContent = "アドバイス取得中...";
    statusEl.classList.remove("error");
    resultCard.classList.add("hidden");

    try {
      const url = "https://api.adviceslip.com/advice";
      const response = await fetch(url, { cache: "no-cache" });

      if (!response.ok) {
        throw new Error("HTTP エラー: " + response.status);
      }

      const data = await response.json();
      const englishText = data.slip.advice;

      const japaneseText = await translateToJapanese(englishText);

      adviceTitle.textContent = "今日のひと言アドバイス（日本語訳つき）";
      adviceText.innerHTML =
        "<strong>日本語:</strong> " +
        japaneseText +
        "<br><br><strong>原文:</strong> \"" +
        englishText +
        "\"";

      adviceId.textContent = "Advice ID: " + data.slip.id;
      statusEl.textContent = "アドバイスを取得しました。";
      resultCard.classList.remove("hidden");
    } catch (error) {
      console.error(error);
      statusEl.textContent =
        "データ取得中または翻訳中にエラーが発生しました。";
      statusEl.classList.add("error");
      resultCard.classList.add("hidden");
    }
  });
}
