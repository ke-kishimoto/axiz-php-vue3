<template>
    <div id="top">
        <div class="head">
            <h2 v-if="editId == -1">{{ title }}登録</h2>
            <h2 v-else>{{ title }}更新</h2>
            <button type="button" @click="goback()">戻る</button>
        </div>
        <div>
            <div v-for="column in columnList" v-bind:key="column.column_name">
                <template v-if="column.column_name !== 'id' && column.column_name !== 'account_id' && column.column_name !== 'account_name'" >
                    <!-- <label v-bind:for="column.column_name">{{column.column_comment}}</label> -->
                    <input type="text" v-if="column.input_type === 'text'" :list="column.column_name" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" v-bind:placeholder="column.column_comment">
                    <datalist v-if="column.column_name.indexOf('category') >= 0" :id="column.column_name">
                        <option v-for="category in categoryList[column.column_name]" v-bind:key="category.category_value" :value="category['category_value']"></option>
                    </datalist>
                    <p v-if="column.input_type === 'textarea'">
                        <label v-bind:for="column.column_name">{{column.column_comment}}</label>
                    </p>
                    <textarea v-if="column.input_type === 'textarea'"  v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" rows="7"></textarea>
                </template>
            </div>
            <div class="modal-btn">
                <div>
                    <button v-if="editId == -1" @click="register">登録</button>
                    <div v-else>
                        <button @click="register">更新</button>
                        <button @click="deleteRecord">削除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'editModal',
    data: function() {
        return {
            tableName: '',
            editId: -1,
            columnList: [],
            categoryList: [],
            form: {
                id: '',
            },
        }
    },
    methods: {
        goback() {
            this.$router.push({name:this.tableName})
        },
        getCategoryList() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            fetch('http://localhost:8888/axiz-php/getCategoryList', {
                method:'post',
                body:params
            })
            .then(res => res.json().then(json => this.categoryList = json))
            .catch(error => console.log(error))
        },
        register() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            let type = 'update';
            if(Number(this.editId) === -1) {
                type = 'insert';
            }
            params.append('type', type);
            Object.keys(this.form).forEach(key => {
                if(!(type === 'insert' && key === 'id') && (key !== 'account_name' && key !== 'update_date')) {
                    params.append(key, this.form[key]);
                }
            })
            fetch('http://localhost:8888/axiz-php/updateRecord', {
                method:'post',
                body:params, 
                credentials: 'include',
            }).then(res => {
                if(res.status !== 200) {
                    console.log(res);
                }else {
                    this.$router.push({name:this.tableName})
                }
            })
            .catch(errors => console.log(errors))
        },
        deleteRecord() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('id', this.form.id);
            fetch('http://localhost:8888/axiz-php/deleteById', {
                method:'post',
                body:params, 
            })
            .then(() => {
                this.$router.push({name:this.tableName})
            })
            .catch(errors => console.log(errors))
        },
        selectById() {
            if(this.editId === -1) {
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
        }
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
        this.getCategoryList();
    },
}
</script>
<style scoped>
#top {
    /* max-width: 900px; */
    margin: 20px auto;
}

input,textarea {
    width: 600px;
    font-size: 18px;
}
input[type="text"] {
    margin:15px 0;
    border-width: 0 0 1px 0;

}
</style>