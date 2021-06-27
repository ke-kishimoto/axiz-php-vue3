<template>
    <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  <h2>CSV取り込み</h2>
                </slot>
              </div>

              <div class="modal-body">
              </div>
                <input type="file" name="fname" @change="selectedFile">
              <div class="modal-footer">
                <slot name="footer">
                  <div class="modal-btn">
                        <button class="btn btn-primary my-2" @click="upload">CSV取り込み</button>
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
     data: function() {
        return {
            uploadFile: null,
        }
     },
    methods: {
selectedFile: function(e) {
            // 選択された File の情報を保存しておく
            e.preventDefault();
            let files = e.target.files;
            this.uploadFile = files[0];
        },
        upload: function() {
            // FormData を利用して File を POST する
            let formData = new FormData();
            formData.append('csvfile', this.uploadFile);
            formData.append('tableName', this.tableName);
            // let config = {
            //     headers: {
            //         'content-type': 'multipart/form-data'
            //     }
            // };
            // axios
            //     .post('./uploadCSV', formData, config)
            //     .then(res => {
            //         if(res.status !== 200) {
            //             console.log(res.data);
            //         } else if(res.data.err_msg !== '') {
            //             this.msg = res.data.err_msg
            //         } else {
            //             this.msg = res.data.cnt + '件登録';
            //             this.search();
            //         }
            //         this.uploadFile = null;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     })
                this.$modal.hide(this.tableName + '-csv-modal');
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

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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