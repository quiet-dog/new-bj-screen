import http from "../utils/http";

export function login() {
    const username = "admin";
    const password = "i6NhzLNLVifEWMsfz/ABPParezXL/p440tM7k/8Zg8eltdPpQlENDbvgENOfNfcGTngi73OLnk1bW9ycS0b5JX1HRncNNJo3Ga8D0egvjNczFkES4ddAi3Xz4L0JbwpMAgwE7joe+44ZBMOA6shTXX5usA5UVCzT7SZwiKAvFas=";
    return http.post("/login", {
        username,
        password
    });
}

export function download(path: string) {
    return http.get("/file/download", {
        params: {
            fileName: path
        },
        responseType: "blob"
    }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        // 以  _ 为分隔符，返回最后一部分
        let p = path.split("_");
        let name = "";
        let sub = path.split(".");
        if (p.length > 2) {
            // 获取第一个到倒数第二个元素中间的部分进行拼接
            name = p.slice(1, p.length - 1).join("_");
            // 获取.后面的部分
            name += "." + sub[sub.length - 1];
        }

        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
    });
}