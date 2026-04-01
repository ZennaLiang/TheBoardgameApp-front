import { logger } from "../utils/logger";

export const createPost = (userId: string, token: string, post: FormData) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("createPost", err); });
};

export const getPosts = (page: number) => {
    return fetch(`${import.meta.env.VITE_API_URL}/posts?page=${page}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("getPosts", err); });
};

export const getPost = (postId: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/${postId}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("getPost", err); });
};

export const getPostsByUserId = (userId: string, token: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/posts/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("getPostsByUserId", err); });
};

export const removePost = (postId: string, token: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("removePost", err); });
};

export const updatePost = (postId: string, token: string, post: FormData) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("updatePost", err); });
};

export const likePost = (userId: string, token: string, postId: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("likePost", err); });
};

export const unlikePost = (userId: string, token: string, postId: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("unlikePost", err); });
};

export const commentPost = (userId: string, token: string, postId: string, comment: unknown) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("commentPost", err); });
};

export const uncommentPost = (userId: string, token: string, postId: string, comment: unknown) => {
    return fetch(`${import.meta.env.VITE_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch(err => { logger.error("uncommentPost", err); });
};
