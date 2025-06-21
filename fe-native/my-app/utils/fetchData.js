
export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Chưa connect được tới backend!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
        return null;
    }
};
