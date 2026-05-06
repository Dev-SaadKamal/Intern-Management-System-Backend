const ResObj = (status, message = "", data = null) => {
    return {
        status,
        message,
        data
    }
}

module.exports = {
    ResObj
}   