import Swal from "sweetalert2";

const getTheme = darkMode => ({
  background: darkMode ? "#151519" : "#ededed",
  color: darkMode ? "#c20aff" : "#5d0085",
  confirmButtonColor: darkMode ? "#c20aff" : "#5d0085",
  cancelButtonColor: darkMode ? "#c20aff" : "#5d0085",
});

const createAlert = (darkMode, config) => {
  const theme = getTheme(darkMode);
  return Swal.fire({ ...theme, ...config });
};

export const deleteOneItemAlert = (darkMode, item) =>
  createAlert(darkMode, {
    width: "20rem",
    text: `Do you want to delete this ${item}?`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

export const deleteOneItemConfirmed = (darkMode, item) =>
  createAlert(darkMode, {
    width: "20rem",
    text: `The ${item} has been deleted.`,
  });

export const deleteAllItemsAlert = (darkMode, items) =>
  createAlert(darkMode, {
    width: "22rem",
    text: `Do you want to delete all the ${items}?`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete all!",
  });

export const deleteAllItemsConfirm = (darkMode, items) =>
  createAlert(darkMode, {
    width: "20rem",
    text: `all the ${items} have been deleted.`,
  });

export const deleteOneBookWithNoteAlert = darkMode =>
  createAlert(darkMode, {
    width: "23rem",
    title: "This book have notes!",
    text: `Do you want to delete this book? notes will be deleted`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

export const deleteAllBooksWithNoteAlert = darkMode =>
  createAlert(darkMode, {
    width: "28rem",
    title: "There are books with notes!",
    text: `Do you want to delete all the books? notes will be deleted`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete all!",
  });

export const deleteAllArchivedBooksAlert = darkMode =>
  createAlert(darkMode, {
    width: "28rem",
    title: "These books have notes!",
    text: `Do you want to delete all the books? notes will be deleted`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete all!",
  });

export const archiveBookAlert = darkMode =>
  createAlert(darkMode, {
    width: "22rem",
    text: `Do you want to archive this book?`,
    showCancelButton: true,
    confirmButtonText: "Yes, archive it!",
  });

export const archiveBookConfirm = darkMode =>
  createAlert(darkMode, {
    width: "20rem",
    text: `The book has been archived.`,
  });

export const moveBackBookAlert = darkMode =>
  createAlert(darkMode, {
    width: "22rem",
    text: `Do you want to move back this book to the current reading?`,
    showCancelButton: true,
    confirmButtonText: "Yes, move it back!",
  });

export const moveBackBookConfirm = darkMode =>
  createAlert(darkMode, {
    width: "20rem",
    text: `The book has been moved back to the current reading.`,
  });
