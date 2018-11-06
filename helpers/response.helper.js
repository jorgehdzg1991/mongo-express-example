module.exports = (res, status, data, contentType = 'application/json') => {
    res.writeHead(status, {
        'Content-Type': contentType
    });
    res.end(JSON.stringify(data));
};