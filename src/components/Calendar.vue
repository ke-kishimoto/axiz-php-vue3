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
                <td v-for="(day, index) in weekDay" v-bind:key="index"  @click="showModal(day)"> 
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
export default {
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
        }
    },
    methods: {
        showModal(date) {
            if (date === '') return;
            this.createFlg = true;
            this.date = date;
            this.clearForm();
            this.$modal.show(this.tableName);
        },
        edit(data) {
            this.createFlg = false;
            this.date = data.day;
            this.form = Object.assign({}, data);
            this.$modal.show(this.tableName);
        },
        view(data) {
            this.form = Object.assign({}, data);
            this.$modal.show('view-' + this.tableName);
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
            // axios.post('./getCalData', params)
            // .then(res => {
            //     this.calDataList = res.data;
            //     this.createCalData();
            // })
            fetch('http://localhost:8888/axiz-php/getCalData', {
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
            // axios.post('./updateRecord', params)
            // .then(res => {
            //     this.getCalData();
            // })
            // .catch(errors => console.log(errors))
            fetch('http://localhost:8888/axiz-php/updateRecord', {
                method: 'post',
                body: params
            })
            .then(res => res.json().then(() => this.getCalData()))
            .catch(errors => console.log(errors))
            this.clearForm();
            this.$modal.hide(this.tableName);
        },
        deleteCalData() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('id', this.form.id);
            // axios.post('./deleteById', params)
            // .then(res => this.getCalData())
            // .catch(errors => console.log(errors))
            fetch('http://localhost:8888/axiz-php/deleteById', {
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
    },
    created: function () {
        const today = new Date(); // 現在の日時
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.createCalendar(today.getFullYear(), today.getMonth());
        this.getCalData();

        // カラムの取得
        let params = new URLSearchParams();
        params.append('tableName', this.tableName);
        // axios.post('./getColumnList', params)
        // .then(res => {
        //     this.columnList = res.data;
        //     this.columnNum = res.data.length;
        //     res.data.forEach(element => {
        //         this.form[element['column_name']] = '';
        //     })
        // })
        fetch('http://localhost:8888/axiz-php/getColumnList', {
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
    }
}
</script>
<style>
@import url(https://use.fontawesome.com/releases/v5.6.1/css/all.css);
#top {
    width: 80%;
}

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