export default {
    data() {
        return {
            pages: 0,
            pageNo: 1
        };
    },
    methods: {
        handlePageChange(internalCurrentPage) {
            this.pageNo = internalCurrentPage;
            this.getData();
        }
    }
};
