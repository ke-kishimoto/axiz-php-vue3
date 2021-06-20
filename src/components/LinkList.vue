<template>
    <div>
        <p>
            コース：
            <select @change="selectRoom($event)">
                <option v-for="room in roomList" v-bind:key="room.room_id" v-bind:value="room.room_id">{{ room.room_name }}</option>
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
    // props: ['selectTableName', 'listTableName','accountId'],
    data: function() {
        return {
            roomList: [],
            roomId: '',
            // subjectList: [],
            displayList: {},
            answerList: [],
        }
    },
    methods: {
        getRoomList() {
            // axios.get('./searchAccountRoomList')
            // .then(response =>  {
            //     this.roomList = response.data
            //     this.roomId = this.roomList[0].room_id
            //     // this.getSubjectList(this.roomId)
            //     this.getAnswerList(this.roomId)
            // })
            fetch('http://localhost:8888/axiz-php/searchAccountRoomList', {
                method: 'get',
            })
            .then(res => {
                if(res.status === 200) {
                    // console.log(res);
                    res.json()
                    .then(json => {
                        console.log(json)
                        this.roomList = json
                        this.roomId = this.roomList[0].room_id
                        this.getAnswerList(this.roomId)
                    })
                } else {
                    console.log(res);
                }
            })
            .catch(error => console.log(error))
        },
        // getSubjectList(roomId) {
        //     let params = new URLSearchParams();
        //     params.append('room_id', roomId);
        //     this.roomId = roomId;
        //     axios.post('./searchSubjectList', params)
        //     .then(response => {
        //         this.subjectList = response.data
        //         this.subjectList.forEach(el => this.$set(this.displayList, [el['subject_code']] , el['display_flg']))
        //     })
        // },
        getAnswerList(roomId) {
            let params = new URLSearchParams();
            params.append('room_id', roomId);
            // axios.post('./searchModelAnswer', params)
            //     .then(response => this.answerList = response.data)
            fetch('http://localhost:8888/axiz-php/searchModelAnswer', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status === 200) {
                    console.log(res);
                    res.json().then(json => this.answerList = json)
                } else {
                    console.log(res);
                }
            })
            .catch(error => console.log(error))
        },
        selectRoom(event) {
            // this.getSubjectList(event.target.value)
            this.getAnswerList(event.target.value)
        },
    },
    created: function() {
        this.getRoomList()
    }
}
</script>
<style scoped>


</style>