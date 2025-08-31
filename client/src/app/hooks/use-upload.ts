import axios from "axios";

const useFileUpload = () => {
    const upload = async (file: any) => {
        if (!file) return null;

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            console.error("Kích thước file không được vượt quá 10MB");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "uploads");

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dv1aepjnp/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress(progressEvent) {
                        if (progressEvent.total !== undefined) {
                            const percentCompleted = Math.floor(
                                (progressEvent.loaded / progressEvent.total) *
                                100
                            );
                            // uploadProgress(percentCompleted, index); 
                        }
                    },
                }
            );

            return response.data.url;
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const uploadMultiple = async (files: any) => {
        files = Array.isArray(files) ? files : Array.from(files);

        if (!files || files.length === 0) return null;
        
        const maxSize = 10 * 1024 * 1024;

        for (let file of files) {
            if (file.size > maxSize) {
                console.error(
                    `Kích thước file ${file.name} không được vượt quá 10MB`
                );
                return null;
            }
        }

        const uploadPromises = files.map((file: any) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default");
            formData.append("folder", "uploads");

            return axios.post(
                "https://api.cloudinary.com/v1_1/dv1aepjnp/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            ).then(res => res.data.url);
        });

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Lỗi khi tải lên file:", error);
        }
    };

    return { upload, uploadMultiple };
};

export default useFileUpload;
