import axios from "axios";

export const generateImageWithDeepAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt },
      {
        headers: {
          "Api-Key": process.env.DEEPAI_API_KEY,
        },
      }
    );

    const imageUrl = response.data.output_url;
    return imageUrl;
  } catch (error) {
    if (error.response) {
      console.error(" Eroare de la DeepAI:", error.response.data);
    } else {
      console.error(" Eroare necunoscută:", error.message);
    }
    throw new Error("Generarea imaginii a eșuat.");
  }
};
