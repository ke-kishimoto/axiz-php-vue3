<template>
    <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  <h2>CSV出力</h2>
                </slot>
              </div>

              <div class="modal-body">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="csv-header" id="csv-head1" v-model="csvHeadType" value="disp">
                        <label class="form-check-label" for="csv-head1">
                            表示名
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="csv-header" id="csv-head2" v-model="csvHeadType" value="column">
                        <label class="form-check-label" for="csv-head2">
                            カラム名
                        </label>
                    </div>
                    <br>
                    <h4>出力項目</h4>
                    <slot name="columnList">

                    </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <div class="modal-btn">
                    <button class="btn btn-primary my-2" @click="downloadCSV">CSV出力</button>
                    <button class="modal-default-button" @click="$emit('close')">閉じる</button>
                </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
    </transition>
</template>

<script>
export default {
    data: function () {
        return {
            csvHeadType: 'disp',
            urlPrefix : 'http://localhost:8888/axiz-php',
        }
    },
    methods: {
        downloadCSV() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('csvHeadType', this.csvHeadType);
            params.append('csvOutputColumn', this.csvOutputColumn);
            // axios.post('./getCSV', params)
            // .then(res => {
            //     let csv = res.data
            //     let blob = new Blob([csv], { type: 'text/csv' })
            //     let link = document.createElement('a')
            //     link.href = window.URL.createObjectURL(blob)
            //     link.download = this.tableName + '.csv'
            //     link.click()
            // })
            // .catch(error => { console.log(error) })
            fetch(this.urlPrefix + '/getCSV', {
                method:'post',
                body:params
            })
            .then(res => res.text().then(text => {
                let csv = text
                let blob = new Blob([csv], { type: 'text/csv' })
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = this.tableName + '.csv'
                link.click() 
            })) 
            .catch(error => { console.log(error) })
            // this.$modal.hide(this.tableName+'-csv-download-modal');
        },
    }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>