export default function validateMediaPath(prefix: string, fileExtension: string, path: string): void {

    if (path.includes("https://")) {
        throw new Error(`src cannot be an external URL. Got ${path}`);
    }

    if (!path.endsWith(fileExtension)) {
        throw new Error(`src must be a .${fileExtension} file.`);
    }

    if (!path) {
        throw new Error("alt text is required.");
    }

    if (path.startsWith(`/${prefix}/`)) {
        throw new Error(`Image src cannot start with /blogimages/. Got ${src}`);
    }
}
