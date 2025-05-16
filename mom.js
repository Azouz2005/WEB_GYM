const API_URL = 'https://6825bacf0f0188d7e72e346f.mockapi.io/api/v1/GYM';

let editingMemberId = null; 
document.addEventListener('DOMContentLoaded', () => {
    fetchMembers();

    document.getElementById('memberForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            phone: document.getElementById('phone').value,
            joinDate: document.getElementById('joinDate').value,
            trainerId: document.getElementById('trainerId').value,
            planId: document.getElementById('planId').value,
            subscriptionId: document.getElementById('subscriptionId').value,
        };

        if (editingMemberId) {
            fetch(`${API_URL}/${editingMemberId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                alert('Member updated successfully');
                fetchMembers();
                this.reset();
                editingMemberId = null;
                const submitBtn = document.querySelector('#memberForm button[type="submit"]');
                submitBtn.textContent = "Add Member";
            })
            .catch(err => alert('Error updating member: ' + err));
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                alert('Member added successfully');
                fetchMembers();
                this.reset();
            })
            .catch(err => alert('Error adding member: ' + err));
        }
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterMembersByName(searchTerm);
    });

    document.getElementById('deleteAllBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete ALL members?')) {
            deleteAllMembers();
        }
    });
});

let allMembers = []; 
function fetchMembers() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allMembers = data;
            renderMembers(data);
        })
        .catch(err => alert('Error fetching members: ' + err));
}

function renderMembers(members) {
    const tbody = document.querySelector('#membersTable tbody');
    tbody.innerHTML = '';
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">No members found.</td></tr>';
        return;
    }
    members.forEach(member => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
            <td>${member.gender}</td>
            <td>${member.phone}</td>
            <td>${member.joinDate}</td>
            <td>${member.trainerId}</td>
            <td>${member.planId}</td>
            <td>${member.subscriptionId}</td>
            <td>
                <button class="edit" onclick="editMember(${member.id})">Edit</button>
                <button class="delete" onclick="deleteMember(${member.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterMembersByName(searchTerm) {
    if (!searchTerm) {
        renderMembers(allMembers);
        return;
    }
    const filtered = allMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm)
    );
    renderMembers(filtered);
}

function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Member deleted successfully');
            fetchMembers();
        })
        .catch(err => alert('Error deleting member: ' + err));
    }
}

function deleteAllMembers() {
    if (allMembers.length === 0) {
        alert('No members to delete.');
        return;
    }
    const deletePromises = allMembers.map(member =>
        fetch(`${API_URL}/${member.id}`, { method: 'DELETE' })
    );

    Promise.all(deletePromises)
        .then(() => {
            alert('All members deleted successfully.');
            fetchMembers();
        })
        .catch(err => alert('Error deleting all members: ' + err));
}

function editMember(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(member => {
            document.getElementById('name').value = member.name;
            document.getElementById('age').value = member.age;
            document.getElementById('gender').value = member.gender;
            document.getElementById('phone').value = member.phone;
            document.getElementById('joinDate').value = member.joinDate;
            document.getElementById('trainerId').value = member.trainerId;
            document.getElementById('planId').value = member.planId;
            document.getElementById('subscriptionId').value = member.subscriptionId;

            editingMemberId = id;

            const submitBtn = document.querySelector('#memberForm button[type="submit"]');
            submitBtn.textContent = "Update Member";
        })
        .catch(() => alert('Failed to fetch member details'));
}
