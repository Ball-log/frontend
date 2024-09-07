import { store } from "../utils/secureStore";

export const getPresignedUrl = async (fileName, fileLocation, fileType) => {
  // S3 프리사인드 URL을 요청하는 함수
  const token = await store.get("Authorization");
  try {
    const response = await fetch("https://api.ballog.store/api-utils/s3", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileName,
        fileLocation: fileLocation,
        fileType: fileType,
        reqType: "put",
      }),
    });

    const data = await response.json();

    if (data.isSuccess) {
      return data.result.presignedUrl;
    } else {
      throw new Error("프리사인드 URL 생성 실패");
    }
  } catch (error) {
    console.error("프리사인드 URL 요청 중 오류 발생:", error);
    throw error;
  }
};

export const uploadFileToS3 = async (presignedUrl, file) => {
  // S3에 파일을 업로드하는 함수
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (response.ok) {
    } else {
      throw new Error("파일 업로드 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    throw error;
  }
};
