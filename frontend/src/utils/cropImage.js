export const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = crop.width;
            canvas.height = crop.height;
            
            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas is empty of failed to generate a blob'));
                    }
                },
                'image/jpeg',
                1
            );
        };
        image.onerror = (error) => reject(error);
    });
}