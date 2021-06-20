<template>
    <div>
        <div>
            <h2 v-if="createFlg">{{ title }}登録</h2>
            <h2 v-else>{{ title }}更新</h2>
        </div>

        <div>
            <div v-for="column in columnList" v-bind:key="column.column_name">
                <template v-if="column.column_name !== 'id' && column.column_name !== 'account_id' && column.column_name !== 'account_name'" >
                    <label v-bind:for="column.column_name">{{column.column_comment}}</label>
                    <input v-if="column.input_type === 'text'" :list="column.column_name" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length">
                    <datalist v-if="column.column_name.indexOf('category') >= 0" :id="column.column_name">
                        <option v-for="category in categoryList[column.column_name]" v-bind:key="category.category_value" :value="category['category_value']"></option>
                    </datalist>
                    <textarea v-if="column.input_type === 'textarea'"  v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" rows="7"></textarea>
                </template>
            </div>
            <div class="modal-btn">
                <div>
                    <button v-if="createFlg" @click="register('insert')">登録</button>
                    <div v-else>
                        <button @click="register('update')">更新</button>
                        <button @click="deleteRecord">削除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'createFlg', 'columnList', 'categoryList', 'form'],
    // data: function() {
    //     return {
    //         columnList: [],
    //         categoryList: [],
    //         form: {},
    //         createFlg: true,
    //     }
    // },
    methods: {
        register(type) {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('type', type);
            Object.keys(this.form).forEach(key => {
                if(!(type === 'insert' && key === 'id') && key !== 'account_name') {
                    params.append(key, this.form[key]);
                }
            })
            params.append('account_id', this.accountId);
            fetch('http://localhost:8888/axiz-php/updateRecord', {
                method:'post',
                body:params
            }).then(res => {
                if(res.status !== 200) {
                    console.log(res);
                }else {
                    this.search();
                }
            })
            .catch(errors => console.log(errors))
            this.$modal.hide(this.tableName+'-regist-modal');
            this.resetForm();
        },
        deleteRecord() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('id', this.form.id);
            fetch('http://localhost:8888/deleteById', {
                method:'post',
                body:params
            })
            .then(() => this.search())
            .catch(errors => console.log(errors))
            this.$modal.hide(this.tableName+'-regist-modal');
            this.resetForm();
        },
    }
    
}
</script>