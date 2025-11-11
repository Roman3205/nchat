export default ():string => {
    const chars = '123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    let res = ''
    for (let i = 0; i < 10; i++) {
        res+=chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return res
}