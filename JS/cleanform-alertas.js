import { summary,place,start,end,description,inveted } from "./functions.js";
export function cleantForm() {
  start.value = "";
  end.value = "";
  summary.value = "";
  description.value = "";
  place.value = "";
  inveted.value = "";
}
export function success(verb) {
    Swal.fire(
      `${verb}!`,
      'Please refresh the page',
      'success'
    )
}
export function error(info) {
    Swal.fire(
      `${info.result.error.message}!`,
      'Please try again',
      'error'
    )
}
export function succesTask() {
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
export function errorTask() {
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
export function weatherAlert() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'info',
    title: 'Activate your location'
  })
}