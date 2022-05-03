// 弹窗
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'
export const hints = () => {
    const router = useRouter();
    //  消息提示
    const hint = (result, path = '') => {
        if (result?.meta?.status === 200 || result?.meta?.status === 201) {
            ElMessage({
                message: result.meta.msg,
                type: 'success'
            });
            setTimeout(() => {
                router.push({ name: path });
            }, 500)
        } else {
            ElMessage({
                message: result.meta.msg,
                type: 'warning',
            })
        }
    }
    // 确定取消
    const confirm = (font,callback, path = '') => {
        ElMessageBox.confirm(`${font}, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                ElMessage({
                    type: 'success',
                    message: '操作成功',
                })
                callback && callback()
                setTimeout(() => {
                    router.push({ name: path });
                }, 1000)
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消操作'
                });
            })
    }
    return { hint, confirm }
}


