export function load({ url }) {
    const params = url.searchParams;
    const decrypt = params.get("decrypt") == "true"
    const user = params.get("text") ?? ""
    const password = params.get("password") ?? ""
    return { decrypt, user, password }
}