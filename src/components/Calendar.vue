<template>
    <div id="top">
        <table class="calendar">
            <tr>
                <td class="calendar-head" colspan= 7>
                    <div class="month">
                        <a href="#" @click="lastMonth()">&lt;</a>
                        <a href="#" @click="nextMonth()">&gt;</a>
                        {{ year }}年{{ month }}月
                    </div>
                </td>
            </tr>
            <tr>
                <th class="sunday">日</th>
                <th>月</th>
                <th>火</th>
                <th>水</th>
                <th>木</th>
                <th>金</th>
                <th class="saturday">土</th>
            </tr>
            <tr v-for="(weekDay, index) in days" v-bind:key="index">
                <td v-for="(day, index) in weekDay" v-bind:key="index"  @click="openCalendarModal(day)"> 
                    <div v-if="day !== ''" class="day">{{ day }}</div>
                    <div v-if="day !== ''" class="day-data">
                        <div v-for="(s, index) in calData[day]" v-bind:key="index" class="cal-data"> 
                            <div v-if="accountId == s.account_id" @click.stop="edit(s)" class="cal-user-data">{{ s.title }}</div>
                            <div v-else @click.stop="view(s)" class="cal-athoer-data">{{ s.title }}</div>
                        </div>
                    </div>
                    <div v-if="day === ''" class="day-blank"></div>
                </td>
            </tr>
        </table>
        <CalendarModal @close="closeCalendarModal" v-if="calendarModal">
            <template v-slot:body>
                <div>
                    <h2 v-if="createFlg">{{ tableComment }}登録</h2>
                    <h2 v-else>{{ tableComment }}更新</h2>
                </div>
                <div>
                    <div v-for="(column, index) in columnList" v-bind:key="index" class="form-group">
                        <div v-if="column.column_name !== 'id' && column.column_name !== 'year' && column.column_name !== 'month' && column.column_name !== 'day' && column.column_name !== 'account_name'">
                            <!-- <label v-bind:for="column.column_name">{{column.column_comment}}</label> -->
                            <input v-if="column.input_type === 'text'" :list="column.column_name" class="form-control" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" v-bind:placeholder="column.column_comment">
                            <datalist v-if="column.column_name.indexOf('category') >= 0" :id="column.column_name">
                                <option v-for="(category, index) in categoryList[column.column_name]" v-bind:key="index" :value="category['category_value']"></option>
                            </datalist>
                            <textarea v-if="column.input_type === 'textarea'" class="form-control" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" rows="7" v-bind:placeholder="column.column_comment"></textarea>
                        </div>
                    </div>
                    <div >
                        <button v-if="createFlg" class="btn btn-primary" @click="register('insert')">登録</button>
                        <div v-else>
                            <button class="btn btn-primary" @click="register('update')">更新</button>
                            <button class="btn btn-danger" @click="deleteCalData()">削除</button>
                        </div>
                    </div>
                </div>
            </template>
        </CalendarModal>
        <!-- <modal v-bind:name="tableName" :scrollable="true" height="auto">
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <h2 v-if="createFlg">{{ tableComment }}登録</h2>
                            <h2 v-else>{{ tableComment }}更新</h2>
                        </div>
                        <div class="card-text">
                            <div v-for="(column, index) in columnList" v-bind:key="index" class="form-group">
                                <div v-if="column.column_name !== 'id' && column.column_name !== 'year' && column.column_name !== 'month' && column.column_name !== 'day' && column.column_name !== 'account_name'">
                                    <label v-bind:for="column.column_name">{{column.column_comment}}</label>
                                    <input v-if="column.input_type === 'text'" :list="column.column_name" class="form-control" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length">
                                    <datalist v-if="column.column_name.indexOf('category') >= 0" :id="column.column_name">
                                        <option v-for="(category, index) in categoryList[column.column_name]" v-bind:key="index" :value="category['category_value']"></option>
                                    </datalist>
                                    <textarea v-if="column.input_type === 'textarea'" class="form-control" v-model="form[column.column_name]" v-bind:maxlength="column.character_maximum_length" rows="7"></textarea>
                                </div>
                            </div>
                            <div >
                                <button v-if="createFlg" class="btn btn-primary" @click="register('insert')">登録</button>
                                <div v-else>
                                    <button class="btn btn-primary" @click="register('update')">更新</button>
                                    <button class="btn btn-danger" @click="deleteCalData()">削除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </modal> -->
        <!-- <modal v-bind:name="'view-'+tableName" :scrollable="true" height="auto">
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <h2>{{ tableComment }}</h2>
                        </div>
                        <div class="card-text">
                            <div v-for="(column, index) in columnList" v-bind:key="index" class="form-group">
                                <div v-if="column.column_name !== 'id' && column.column_name !== 'year' && column.column_name !== 'month' && column.column_name !== 'day'">
                                    <span class="text-muted">{{ column.column_comment }}</span>
                                    <p>
                                        <pre>{{ form[column.column_name] }}</pre>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </modal> -->
    </div>
</template>
<script>
import CalendarModal from './CalendarModal.vue'
export default {
    components: { CalendarModal },
    props: ['tableComment', 'tableName', 'accountId'],
    data: function() {
        return {
            columnNum: 0,
            columnList: [],
            year: '',
            month: '',
            date: '',
            days: [],
            form: {
                id: '',
            },
            createFlg: false,
            calDataList: [],
            lastDate: -1,
            calData: {},
            calendarModal: false,
            urlPrefix : 'http://localhost:8888/axiz-php',
        }
    },
    methods: {
        openCalendarModal(date) {
            this.createFlg = true;
            this.date = date;
            this.calendarModal = true
        },
        closeCalendarModal() {
            this.calendarModal = false
        },
        // showModal(date) {
        //     if (date === '') return;
        //     this.createFlg = true;
        //     this.date = date;
        //     this.clearForm();
        //     this.$modal.show(this.tableName);
        // },
        edit(data) {
            this.createFlg = false;
            this.date = data.day;
            this.form = Object.assign({}, data);
            this.createFlg = false;
            this.calendarModal = true
        },
        view(data) {
            this.form = Object.assign({}, data);
            this.$modal.show('view-' + this.tableName);
            // this.$router.push({name:'viewModal', query: {tableName: this.tableName, editId: data.id, title: this.title}});
        },
        clearForm() {
            Object.keys(this.form).forEach(key => {
                this.form[key] = '';
            })
        },
        createCalData() {
            let index = 0;
            this.calData = {};
            for(let i=1; i<=this.lastDate; i++) {
                this.calData[i] = [];
                for(let j=index; j<=this.calDataList.length; j++) {
                    if(this.calDataList[index] === undefined) {
                        break;
                    } else if(i < Number(this.calDataList[index].day)) {
                        break;
                    } else if (i === Number(this.calDataList[index].day)) {
                        this.calData[i].push(this.calDataList[index]);
                        index++;
                    } else {
                        index++;
                    }
                }
            }
        },
        getCalData() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('month', this.month);
            fetch(this.urlPrefix + '/getCalData', {
                method: 'post',
                body: params
            })
            .then(res => res.json()
                .then(json => {
                    this.calDataList = json;
                    this.createCalData();
                })
            )
            .catch(errors => console.log(errors))
        },
        register(type) {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('type', type);
            params.append('year', this.year);
            params.append('month', this.month);
            params.append('day', this.date);
            Object.keys(this.form).forEach(key => {
                if(!(type === 'insert' && key === 'id') && !(key === 'year' || key === 'month' || key === 'day') && key !== 'account_name') {
                    params.append(key, this.form[key]);
                }
            })
            params.append('account_id', this.accountId);
            fetch(this.urlPrefix + '/updateRecord', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status !== 200) {
                    console.log(res);
                } else {
                    res.json().then(() => this.getCalData())
                }
            })
            .catch(errors => console.log(errors))
            this.clearForm();
            this.closeCalendarModal();
            // this.$modal.hide(this.tableName);
        },
        deleteCalData() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('id', this.form.id);
            fetch(this.urlPrefix + '/deleteById', {
                method: 'post',
                body: params
            })
            .then(res => res.json().then(() => this.getCalData()))
            .catch(errors => console.log(errors))
            this.$modal.hide(this.tableName);
            this.clearForm();
        },
        lastMonth() {
            this.year = this.month === 1 ? this.year - 1 : this.year;
            this.month = this.month === 1 ? 12 : this.month - 1;
            this.createCalendar(this.year, this.month - 1);
            this.getCalData();
        },
        nextMonth() {
            this.year = this.month === 12 ? this.year + 1 : this.year;
            this.month = this.month === 12 ? 1 : this.month + 1;
            this.createCalendar(this.year, this.month - 1);
            this.getCalData();
        },
        createCalendar(year, month) {
            const start = new Date(year, month, 1);     // 月初
            const last = new Date(year, month + 1, 0);  // 月末
            const startDate = start.getDate();          // 月初
            const lastDate = last.getDate();            // 月末
            const startDay = start.getDay();            // 月初の曜日
            const lastDay = last.getDay();              // 月末の曜日

            this.lastDate = lastDate;
            this.days = [];
            let weekDay = [];
            let dayCount = 0; // 曜日カウント用
            for (let i = startDate; i <= lastDate; i++) {
                if (i === startDate) {
                    for (let j = 0; j < startDay; j++) {
                        weekDay.push('');
                        dayCount++;
                    }
                }
                weekDay.push(i);
                dayCount++;
                if (dayCount === 7) {
                    this.days.push(weekDay);
                    dayCount = 0;
                    weekDay = [];
                }
            }
            for (let i = lastDay; i < 6; i++) {
                weekDay.push('');
            }
            this.days.push(weekDay);
        },
        init() {
            const today = new Date(); // 現在の日時
            this.year = today.getFullYear();
            this.month = today.getMonth() + 1;
            this.createCalendar(today.getFullYear(), today.getMonth());
            this.getCalData();

            // カラムの取得
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            fetch(this.urlPrefix + '/getColumnList', {
                method:'post',
                body: params
            })
            .then(res => res.json()
                .then(json => {
                    this.columnList = json;
                    this.columnNum = json.length;
                    json.forEach(element => {
                        this.form[element['column_name']] = '';
                    })
                })
            )
            .catch(errors => console.log(errors))
        },
    },
    created: function () {
        this.init()
    },
    watch: {
        tableName() {
            this.init()
        }
    }

}
</script>
<style scoped>
@import url(https://use.fontawesome.com/releases/v5.6.1/css/all.css);
/* #top {
    width: 80%;
} */

table.calendar {
    width: 100%;
    table-layout: fixed;
}
table.calendar tr th {
    height: 40px;
    text-align: center;
}
table.calendar tr td {
    height: 110px;
}
table.calendar tr td.calendar-head {
    height: 60px;
}
.sunday {
    background-color: tomato;
    color: white;
}
.saturday {
    background-color: blue;
    color: white;
}
.day-blank {
    width: 100%;
    height: 100%;
    background-color: #EEE;
}
div.day {
    margin-left: 5%;
}
div.day-user-data {
    height: 60%;
    overflow: scroll;
}
table.calendar th,
table.calendar td {
    border: 1px solid #CCC;
    padding: 0;
}
table.calendar td.calendar-head {
    border: 0;
}
tr td .cal-user-data, tr td .cal-athoer-data {
    color: white;
    /* background-color: royalblue; */
    width: 95%;
    margin: 2px auto;
    border-radius: 5%;
    cursor: pointer;
    text-align: center;
}
tr td .cal-user-data {
    background-color: royalblue;
}
tr td .cal-athoer-data {
    background-color: tomato;
}
</style>