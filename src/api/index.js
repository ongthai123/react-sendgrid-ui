
const sendEmail = (data) => {
    fetch('https://localhost:44309/api/email/send', {
        method: 'post',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        return response.json();
    }).then(function (responseData) {
        console.log("responseData: ", responseData)
    });
}

export {
    sendEmail
}
