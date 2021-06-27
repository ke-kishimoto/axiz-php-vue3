<template>
    <div>
        <div>
            <h2>{{ title }}</h2>
            <button type="button" @click="goback()">戻る</button>
        </div>
        <div>
            <div v-for="column in columnList" v-bind:key="column.column_name">
                <template v-if="column.column_name !== 'id' && column.column_name !== 'account_id' && column.column_name !== 'account_name'">
                <span class="title">{{ column.column_comment }}</span>
                <p class="content">
                    <pre>{{ form[column.column_name] }}</pre>
                </p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            tableName: '',
            editId: -1,
            columnList: [],
            form: {
                id: '',
            },
        }
    },
    methods: {
        goback() {
            this.$router.push({name:this.tableName})
        },
        selectById() {
            if(this.editId === -1) {
                this.createFlg = true
                return
            }
            let params = new URLSearchParams();
            params.append('id', this.editId);
            params.append('tableName', this.tableName);
            fetch('http://localhost:8888/axiz-php/selectById', {
                 method:'post',
                body: params,
                credentials: 'include',
            })
            .then(res => res.json().then(data => {
                this.form = Object.assign({}, data)
            }))
            .catch(error => console.log(error))
        },
    },
    created: function() {
        this.tableName = this.$route.query.tableName;
        this.editId = this.$route.query.editId;
        this.title = this.$route.query.title;
        let params = new URLSearchParams();
        params.append('tableName', this.tableName);
        fetch('http://localhost:8888/axiz-php/getColumnList', {
            method:'post',
            body: params,
        })
        .then(res => res.json()
            .then(json => {
                this.columnList = json;
                json.forEach(element => {
                    if(element['column_name'] !== 'account_name' && element['column_name'] !== 'update_date') {
                        this.form[element['column_name']] = '';
                    }
                })
            this.selectById();
            })
        )
        .catch(errors => console.log(errors))
    },
}
</script>

<style scoped>
span.title {
    font-size: 18px;
}
p.content {
    font-size: 24px;
}
</style>