// ========================================
// DATA PASIEN
// ========================================

let patients = JSON.parse(
    localStorage.getItem("patients")
) || [
    {
        id: "P001",
        nama: "Uin",
        alamat: "Jl. Gamel Indonesia",
        penyakit: "Flu",
        nomorRuang: "R023",
        bpjs: "Kelas I",
        tanggalMasuk: "2020-02-05",
        tanggalKeluar: "2020-02-13"
    }
];


// ========================================
// ELEMENT
// ========================================

const modal = document.getElementById("patientModal");

const openFormBtn =
    document.getElementById("openFormBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const patientForm =
    document.getElementById("patientForm");

const patientTable =
    document.getElementById("patientTable");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// FORM ELEMENT

const idPasien =
    document.getElementById("idPasien");

const nama =
    document.getElementById("nama");

const alamat =
    document.getElementById("alamat");

const penyakit =
    document.getElementById("penyakit");

const nomorRuang =
    document.getElementById("nomorRuang");

const bpjs =
    document.getElementById("bpjs");

const tanggalMasuk =
    document.getElementById("tanggalMasuk");

const tanggalKeluar =
    document.getElementById("tanggalKeluar");

const editIndex =
    document.getElementById("editIndex");

const modalTitle =
    document.getElementById("modalTitle");


// ========================================
// SIMPAN LOCAL STORAGE
// ========================================

function saveData() {

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );
}


// ========================================
// TAMPILKAN DATA
// ========================================

function renderPatients(data = patients) {

    patientTable.innerHTML = "";

    if (data.length === 0) {

        emptyState.style.display = "block";

        updateStatistics();

        return;
    }

    emptyState.style.display = "none";


    data.forEach((patient, index) => {

        const originalIndex =
            patients.findIndex(
                item => item.id === patient.id
            );

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                <span class="patient-id">
                    ${patient.id}
                </span>
            </td>

            <td>
                <strong>${patient.nama}</strong>
            </td>

            <td>
                ${patient.alamat}
            </td>

            <td>
                ${patient.penyakit}
            </td>

            <td>
                ${patient.nomorRuang}
            </td>

            <td>
                <span class="bpjs">
                    ${patient.bpjs}
                </span>
            </td>

            <td>
                ${formatDate(patient.tanggalMasuk)}
            </td>

            <td>
                ${
                    patient.tanggalKeluar
                    ? formatDate(patient.tanggalKeluar)
                    : "-"
                }
            </td>

            <td>

                <div class="action">

                    <button
                        class="edit-btn"
                        onclick="editPatient(${originalIndex})"
                        title="Edit"
                    > Edit
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePatient(${originalIndex})"
                        title="Hapus"
                    >Hapus
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>
        `;

        patientTable.appendChild(row);
    });


    updateStatistics();
}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatDate(date) {

    if (!date) return "-";

    const d =
        new Date(date);

    return d.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// ========================================
// STATISTIK
// ========================================

function updateStatistics() {

    document.getElementById(
        "totalPasien"
    ).textContent = patients.length;


    document.getElementById(
        "pasienTerdaftar"
    ).textContent = patients.length;


    const rawatInap =
        patients.filter(
            patient =>
                !patient.tanggalKeluar ||
                patient.tanggalKeluar >=
                new Date().toISOString().split("T")[0]
        ).length;


    document.getElementById(
        "rawatInap"
    ).textContent = rawatInap;
}


// ========================================
// BUKA MODAL
// ========================================

function openModal() {

    modal.classList.add("show");

    setTimeout(() => {
        idPasien.focus();
    }, 200);
}


// ========================================
// TUTUP MODAL
// ========================================

function closeModalFunction() {

    modal.classList.remove("show");

    patientForm.reset();

    editIndex.value = "";

    modalTitle.textContent =
        "Tambah Pasien";
}


// ========================================
// EVENT MODAL
// ========================================

openFormBtn.addEventListener(
    "click",
    () => {

        closeModalFunction();

        openModal();
    }
);


closeModal.addEventListener(
    "click",
    closeModalFunction
);


cancelBtn.addEventListener(
    "click",
    closeModalFunction
);


// Klik area luar modal

modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModalFunction();
        }
    }
);


// ========================================
// TAMBAH / EDIT PASIEN
// ========================================

patientForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const patient = {

            id:
                idPasien.value.trim(),

            nama:
                nama.value.trim(),

            alamat:
                alamat.value.trim(),

            penyakit:
                penyakit.value.trim(),

            nomorRuang:
                nomorRuang.value.trim(),

            bpjs:
                bpjs.value,

            tanggalMasuk:
                tanggalMasuk.value,

            tanggalKeluar:
                tanggalKeluar.value
        };


        // VALIDASI ID

        const currentIndex =
            editIndex.value;


        const duplicate =
            patients.some(
                (item, index) =>
                    item.id.toLowerCase() ===
                    patient.id.toLowerCase() &&
                    index !==
                    Number(currentIndex)
            );


        if (duplicate) {

            alert(
                "ID pasien sudah digunakan!"
            );

            return;
        }


        // MODE EDIT

        if (currentIndex !== "") {

            patients[
                Number(currentIndex)
            ] = patient;


            showToast(
                "Data pasien berhasil diperbarui!"
            );

        }

        // MODE TAMBAH

        else {

            patients.push(patient);


            showToast(
                "Pasien berhasil ditambahkan!"
            );
        }


        saveData();

        renderPatients();

        closeModalFunction();
    }
);


// ========================================
// EDIT PASIEN
// ========================================

function editPatient(index) {

    const patient =
        patients[index];


    idPasien.value =
        patient.id;

    nama.value =
        patient.nama;

    alamat.value =
        patient.alamat;

    penyakit.value =
        patient.penyakit;

    nomorRuang.value =
        patient.nomorRuang;

    bpjs.value =
        patient.bpjs;

    tanggalMasuk.value =
        patient.tanggalMasuk;

    tanggalKeluar.value =
        patient.tanggalKeluar;


    editIndex.value =
        index;


    modalTitle.textContent =
        "Edit Data Pasien";


    openModal();
}


// ========================================
// HAPUS PASIEN
// ========================================

function deletePatient(index) {

    const patient =
        patients[index];


    const confirmDelete =
        confirm(
            `Apakah Anda yakin ingin menghapus data pasien ${patient.nama}?`
        );


    if (!confirmDelete) return;


    patients.splice(index, 1);

    saveData();

    renderPatients();


    showToast(
        "Data pasien berhasil dihapus!"
    );
}


// ========================================
// PENCARIAN
// ========================================

searchInput.addEventListener(
    "input",
    function() {

        const keyword =
            this.value
                .toLowerCase()
                .trim();


        const filtered =
            patients.filter(
                patient =>
                    patient.id
                        .toLowerCase()
                        .includes(keyword)
            );


        renderPatients(filtered);
    }
);


// ========================================
// TOAST
// ========================================

function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2500);
}


// ========================================
// ESCAPE UNTUK MENUTUP MODAL
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeModalFunction();
        }
    }
);


// ========================================
// RENDER AWAL
// ========================================

renderPatients();
