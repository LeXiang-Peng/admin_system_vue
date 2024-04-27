const role_map = new Map();
const ROLE_ADMIN = "dX==Nlcl9yb2=xlOplxmFkbW1lugd=l%+yc?";
const ROLE_STUDENT = "dX==Nlcl9yplxb2=xl1OnN0dWRlbnQ==xi%+sy?";
const ROLE_TEACHER = "dX==Nlcl9yb2xlO=nRlYpl1xWNoZXI==ld%+sy?";
role_map.set("admin", ROLE_ADMIN);
role_map.set("student", ROLE_STUDENT);
role_map.set("teacher", ROLE_TEACHER);
role_map.set(ROLE_ADMIN, 1);
role_map.set(ROLE_STUDENT, 2);
role_map.set(ROLE_TEACHER, 3);

export async function setIdCard(role) {
    sessionStorage.setItem('id_card', role_map.get(role));
}

export async function setLocalIdCard(role) {
    localStorage.setItem('id_card', role_map.get(role));
}

export function getId() {
    let key = sessionStorage.getItem('id_card');
    if (!key || key === '') key = localStorage.getItem('id_card');
    return role_map.get(key);
}