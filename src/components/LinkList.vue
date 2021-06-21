<template>
    <div>
        <p>
            コース：
            <select @change="changeSelect($event)">
                <option v-for="item in selectList" v-bind:key="item.id" v-bind:value="item.id">{{ item.name }}</option>
            </select>
        </p>
        <br>
        <ul>
            <template v-for="answer in answerList">
                <li v-if="answer.display_flg === '1'" v-bind:key="answer.id">
                    <a v-bind:href="answer.filepath" target="_blank">{{ answer.file_name }}</a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['selectTableName', 'listTableName','accountId'],
    data: function() {
        return {
            selectList: [],
            targetId: '',
            // subjectList: [],
            displayList: {},
            answerList: [],
        }
    },
    methods: {
        getSelectList() {
            let params = new URLSearchParams();
            params.append('tableName', this.selectTableName);
            params.append('accountId', this.accountId);
            fetch('http://localhost:8888/axiz-php/getSelectboxList', {
                method: 'post',
                body: params,
                credentials: 'include',
            })
            .then(res => {
                if(res.status === 200) {
                    res.json()
                    .then(json => {
                        console.log(json)
                        this.selectList = json
                        this.targetId = this.selectList[0].id
                        this.getItemList(this.targetId)
                    })
                } else {
                    console.log(res);
                }
            })
            .catch(error => console.log(error))
        },
        // getSubjectList(targetId) {
        //     let params = new URLSearchParams();
        //     params.append('room_id', targetId);
        //     this.targetId = targetId;
        //     axios.post('./searchSubjectList', params)
        //     .then(response => {
        //         this.subjectList = response.data
        //         this.subjectList.forEach(el => this.$set(this.displayList, [el['subject_code']] , el['display_flg']))
        //     })
        // },
        getItemList(targetId) {
            let params = new URLSearchParams();
            params.append('room_id', targetId);
            fetch('http://localhost:8888/axiz-php/searchModelAnswer', {
                method: 'post',
                body: params,
                credentials: 'include',
            })
            .then(res => {
                if(res.status === 200) {
                    res.json().then(json => this.answerList = json)
                } else {
                    console.log(res);
                }
            })
            .catch(error => console.log(error))
        },
        changeSelect(event) {
            // this.getSubjectList(event.target.value)
            this.getItemList(event.target.value)
        },
    },
    created: function() {
        this.getSelectList()
    }
}
</script>
<style scoped>


</style>