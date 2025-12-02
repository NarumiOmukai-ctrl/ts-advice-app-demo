// main.ts
// TypeScript で書いた簡単な API クライアント。
// 公開API（Advice Slip API）で取得した英語のアドバイスを
// 日本語に翻訳して表示する。

interface AdviceSlipResponse {
  slip: {
    id: number;
    advice: string;
  };
}

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
}

const fetchButton = document.getElementById("fetchButton") as HTMLButtonElement | null;
const statusEl = document.getElementById("status") as HTMLParagraphElement | null;
const resultCard = document.getElementById("resultCard") as HTMLElement | null;

const adviceTitle = document.getElementById("adviceTitle") as HTMLHeadingElement | null;
const adviceText = document.getElementById("adviceText") as HTMLParagraphElement | null;
const adviceId = document.getElementById("adviceId") as HTMLParagraphElement | null;

// 翻訳関数（MyMemory API）
async function translateToJapanese(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=en|ja`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("翻訳 API の呼び出しに失敗しました");
  }

  const data = (await res.json()) as TranslationResponse;
  return data.responseData.translatedText;
}

if (fetchButton && statusEl && resultCard && adviceTitle && adviceText && adviceId) {
  fetchButton.addEventListener("click", async () => {
    statusEl.textContent = "アドバイス取得中...";
    statusEl.classList.remove("error");
    resultCard.classList.add("hidden");

    try {
      // ① 英語アドバイスを取得
      const url = "https://api.adviceslip.com/advice";
      const response = await fetch(url, { cache: "no-cache" });

      if (!response.ok) {
        throw new Error(`HTTP エラー: ${response.status}`);
      }

      const data = (await response.json()) as AdviceSlipResponse;
      const englishText = data.slip.advice;

      // ② 日本語翻訳を取得
      const japaneseText = await translateToJapanese(englishText);

      // ③ 表示
      adviceTitle.textContent = "今日のひと言アドバイス（日本語訳つき）";
      adviceText.innerHTML = `
        <strong>日本語:</strong> ${japaneseText}<br><br>
        <strong>原文:</strong> "${englishText}"
      `;
      adviceId.textContent = `Advice ID: ${data.slip.id}`;

      statusEl.textContent = "アドバイスを取得しました。";
      resultCard.classList.remove("hidden");
    } catch (error) {
      console.error(error);
      statusEl.textContent =
        "データ取得中または翻訳中にエラーが発生しました。後でもう一度お試しください。";
      statusEl.classList.add("error");
      resultCard.classList.add("hidden");
    }
  });
}
