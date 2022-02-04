import Router from "next/router";

export default function Api() {
  const store = Router.query.store;
  const href = `/api/`;

  const request: any = async (path: string, options: any = {}) => {
    const pathWithSlash = path.replace(/^\/?/, "");
    const response = await fetch(`${href}${pathWithSlash}`, options);

    let payload;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("json")) {
      payload = await response.json();
    } else if (contentType?.includes("text")) {
      payload = await response.text();
    } else {
      payload = response.body;
    }

    if (!response.ok) {
      console.log({ payload, response });
      throw new Error(payload.error || `${options.method} ${pathWithSlash} - ${response.statusText}`);
    }

    // When its a redirect
    if (payload.redirect) {
      const { url } = payload;

      // handle store url
      const urlWithSlash = `${url.charAt(0) !== "/" ? "/" : ""}${url}`;
      return new Promise(() =>
        Router.push({
          pathname: `${urlWithSlash}`,
          query: { store },
        })
      );
    }

    return { payload, response };
  };

  return {
    request,
    get: (path: string) => request(path, { method: "GET" }),
    delete: (path: string) => request(path, { method: "DELETE" }),
    post: (path: string, payload: any = {}, options: any = {}) =>
      request(path, {
        ...options,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  };
}
