async function send(apiUrl, formData) {
    let response;
    try {
        response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        response = await response.json();
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: 'There was an error sending the message. Please try it again.',
        };
    }

    return {
        success: true,
        message: response.data,
    };
}

export default send;
