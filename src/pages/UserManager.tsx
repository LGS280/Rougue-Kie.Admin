import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import DataTable, { type Column } from '../components/DataTable';
import { EntityModal, type FormField } from '../components/EntityModal';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, User, ShieldAlert } from 'lucide-react';

interface UserAccount {
  id: number;
  username: string;
  email: string;
  roleName: string | null;
}

const UserManager = () => {
  const { isAuthenticated, role } = useAuth();
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      const usersData = await axiosClient.get('/users');
      setUsers(usersData as any);
    } catch (error) {
      console.error('Failed to load users telemetry', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWritable) {
      fetchUsersAndRoles();
    }
  }, [isWritable]);

  if (!isWritable) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300 space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/40 flex items-center justify-center text-[#F43F5E] shadow-lg shadow-[#F43F5E]/10 animate-pulse">
          <ShieldAlert size={32} />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-[#F43F5E] font-mono tracking-wide">ACCESS DENIED</h2>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Your current security credentials do not grant you clearance to view or manage the space station crew directory. Please contact the Station Commander (Admin) to request higher clearance.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/users', formData);
      setModalOpen(false);
      setFormData({ username: '', email: '', password: '' });
      fetchUsersAndRoles();
    } catch (error: any) {
      alert(error.response?.data || 'Failed to authorize new command crew member.');
    }
  };

  const columns: Column<UserAccount>[] = [
    {
      header: 'ID',
      accessor: 'id',
      fontMono: true
    },
    {
      header: 'Crew Member',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA]">
            <User size={15} />
          </div>
          <div>
            <div className="font-bold text-gray-200 font-sans">{item.username}</div>
            <div className="text-[10px] text-gray-500 font-mono">Status: Connected</div>
          </div>
        </div>
      )
    },
    {
      header: 'Comms Address (Email)',
      accessor: (item) => (
        <div className="flex items-center gap-2 font-mono">
          <Mail size={14} className="text-gray-500" />
          <span>{item.email}</span>
        </div>
      )
    },
    {
      header: 'Authorization Level (Role)',
      accessor: (item) => {
        const isStaff = item.roleName === 'Admin' || item.roleName === 'Developer';
        return (
          <div className="flex items-center gap-2">
            <Shield size={14} className={isStaff ? 'text-[#F43F5E]' : 'text-gray-500'} />
            <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isStaff ? 'text-[#F43F5E]' : 'text-emerald-400'}`}>
              {item.roleName || 'PLAYER'}
            </span>
          </div>
        );
      }
    }
  ];

  const formFields: FormField[] = [
    {
      name: 'username',
      label: 'Callsign (Username)',
      type: 'text',
      placeholder: 'Enter unique username...',
      required: true
    },
    {
      name: 'email',
      label: 'Comms Channel (Email)',
      type: 'text',
      placeholder: 'Enter valid email...',
      required: true
    },
    {
      name: 'password',
      label: 'Encryption Key (Password)',
      type: 'text',
      placeholder: 'Enter password...',
      required: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Read-only Alert for Players */}
      {!isWritable && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-4 rounded-xl flex items-center gap-3">
          <ShieldAlert className="text-rose-500" size={20} />
          <p className="text-xs text-rose-300 font-sans">
            <strong>Security Override Active:</strong> You do not possess the required clearance level (Admin or Developer) to provision new crew members.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 font-mono text-gray-500 animate-pulse">
          Connecting to orbital directory server...
        </div>
      ) : (
        <DataTable
          title="Space Station Crew Members (User Accounts)"
          data={users}
          columns={columns}
          searchKey="username"
          searchPlaceholder="Search crew callsign..."
          onAdd={isWritable ? () => setModalOpen(true) : undefined}
          addButtonText="Register New Crew"
          isWritable={isWritable}
        />
      )}

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision New Crew Member"
        fields={formFields}
        formData={formData}
        onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
        onSubmit={handleCreateUser}
        submitButtonText="Authorize Crew"
      />
    </div>
  );
};

export default UserManager;
