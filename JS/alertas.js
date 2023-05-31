function cleantForm() {
    start.value = "";
    end.value = "";
    summary.value = "";
    description.value = "";
    inveted.value = "";
}
function success(verb) {
    Swal.fire(
      `${verb}!`,
      'Please refresh the page',
      'success'
    )
}
function error(info) {
    Swal.fire(
      `${info}!`,
      'Please try again',
      'error'
    )
}
function succesTask() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'success',
    title: 'New Task Created!'
  })
}
function errorTask() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'error',
    title: "Don't forget the title!"
  })
}

export {cleantForm,success,error,succesTask,errorTask}