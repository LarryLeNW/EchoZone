import request from "@/utils/request";

export const register = (data : RegisterType) => {
    return request({
        url: "/auth/register",
        method: "post",
        data,
    });
};
