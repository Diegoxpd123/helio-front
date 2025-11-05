import { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  message,
  TableProps,
  Select,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
} from 'antd';
import type { TableColumnType } from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  QuestionCircleFilled,
  BellFilled,
  DownOutlined,
  FileTextFilled,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { departmentsApi } from '../services/api';
import type { Department } from '../services/api';
import './DepartmentsView.css';

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [subdepartmentsData, setSubdepartmentsData] = useState<Record<number, Department[]>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentsApi.getAll({
        search: searchText,
        sortField,
        sortOrder,
        page: pagination.current,
        perPage: pagination.pageSize,
      });

      setDepartments(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
      setTotalEmployees(response.data.total_employees);
    } catch (error) {
      message.error('Error al cargar los departamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [pagination.current, pagination.pageSize, searchText, sortField, sortOrder]);

  const handleTableChange: TableProps<Department>['onChange'] = (
    newPagination,
    _filters,
    sorter: any
  ) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });

    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (department: Department) => {
    setEditingDepartment(department);
    form.setFieldsValue(department);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingDepartment) {
        await departmentsApi.update(editingDepartment.id, values);
        message.success('Departamento actualizado exitosamente');
      } else {
        await departmentsApi.create(values);
        message.success('Departamento creado exitosamente');
      }
      
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      message.error('Error al guardar el departamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await departmentsApi.delete(id);
      message.success('Departamento eliminado exitosamente');
      fetchDepartments();
    } catch (error) {
      message.error('Error al eliminar el departamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubdepartments = async (departmentId: number) => {
    try {
      const response = await departmentsApi.getSubdepartments(departmentId);
      setSubdepartmentsData({
        ...subdepartmentsData,
        [departmentId]: response.data.data,
      });
    } catch (error) {
      message.error('Error al cargar subdepartamentos');
      console.error(error);
    }
  };

  const handleExpand = (expanded: boolean, record: Department) => {
    if (expanded && record.sub_departments_count > 0) {
      fetchSubdepartments(record.id);
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
    }
  };

  const handleSubdivisionClick = (record: Department) => {
    if (record.sub_departments_count > 0) {
      const isExpanded = expandedRowKeys.includes(record.id);
      handleExpand(!isExpanded, record);
    }
  };

  const columns: TableColumnType<Department>[] = [
    {
      title: 'División',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      filters: [
        { text: 'Strategy', value: 'Strategy' },
        { text: 'Producto', value: 'Producto' },
        { text: 'Dirección general', value: 'Dirección general' },
        { text: 'Operaciones', value: 'Operaciones' },
        { text: 'CEO', value: 'CEO' },
      ],
      onFilter: (value, record) => record.name.indexOf(value as string) === 0,
      filterSearch: true,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'División superior',
      dataIndex: 'parent_department_name',
      key: 'parent_department_name',
      sorter: true,
      filters: [
        { text: 'Dirección general', value: 'Dirección general' },
        { text: 'Producto', value: 'Producto' },
        { text: 'Operaciones', value: 'Operaciones' },
      ],
      onFilter: (value, record) => {
        if (!record.parent_department_name) return value === null;
        return record.parent_department_name.indexOf(value as string) === 0;
      },
      render: (text) => text || '-',
    },
    {
      title: 'Colaboradores',
      dataIndex: 'employees_count',
      key: 'employees_count',
      sorter: true,
      align: 'center',
    },
    {
      title: 'Nivel',
      dataIndex: 'level',
      key: 'level',
      sorter: true,
      align: 'center',
      filters: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: 'Subdivisiones',
      dataIndex: 'sub_departments_count',
      key: 'sub_departments_count',
      sorter: true,
      align: 'center',
      render: (count, record) => (
        <Space 
          style={{ cursor: count > 0 ? 'pointer' : 'default' }}
          onClick={() => handleSubdivisionClick(record)}
        >
          {count}
          {count > 0 && (
            <Tag 
              color="green" 
              style={{ 
                borderRadius: '50%', 
                padding: '0 6px',
                cursor: 'pointer'
              }}
            >
              +
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Embajadores',
      dataIndex: 'ambassador_name',
      key: 'ambassador_name',
      sorter: true,
      render: (text) => text || '-',
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_: any, record: Department) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este departamento?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="departments-layout">
      <Header className="header">
        <div className="header-left">
          <div className="logo">
            <img src="/fc1e243d42adae1dce02bc51bf93aa48854c8014.png" alt="Logo" className="logo-image" />
          </div>
          <button className="hamburger-menu" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
          <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </a>
            <a href="#" className="nav-item active" onClick={() => setMobileMenuOpen(false)}>
              Organización
            </a>
            <a href="#" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Modelos <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </a>
            <a href="#" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Seguimiento <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </a>
          </nav>
        </div>
        <div className="header-right">
          <FileTextFilled className="header-icon" />
          <QuestionCircleFilled className="header-icon" />
          <div className="notification-wrapper">
            <BellFilled className="header-icon" />
            <span className="notification-badge">3</span>
          </div>
          <div className="user-avatar">
            <div className="avatar-circle">A</div>
            <span className="user-name">Administrador</span>
            <DownOutlined style={{ fontSize: '10px' }} />
          </div>
        </div>
      </Header>
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}

      <Content className="content">
        <div className="content-header">
          <h1>Organización</h1>
          <div className="tabs-section">
            <div className="tabs">
              <button className="tab active">Divisiones</button>
              <button className="tab">Colaboradores</button>
            </div>
            <div className="action-buttons">
              <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} />
              <Button icon={<UploadOutlined />} disabled title="Importar (próximamente)" />
              <Button icon={<DownloadOutlined />} disabled title="Exportar (próximamente)" />
            </div>
          </div>
        </div>

        <Card className="departments-card">
          <div className="table-controls">
            <div className="view-options">
              <Button type="primary" className="view-btn-left active">
                Listado
              </Button>
              <Button className="view-btn-right">Árbol</Button>
            </div>

            <div className="search-section">
              <Select
                placeholder="Columnas"
                suffixIcon={<DownOutlined />}
                style={{ width: 150 }}
                className="columns-select"
              >
                <Option value="name">División</Option>
                <Option value="parent">División superior</Option>
                <Option value="employees">Colaboradores</Option>
                <Option value="level">Nivel</Option>
                <Option value="subdivisiones">Subdivisiones</Option>
                <Option value="ambassador">Embajadores</Option>
              </Select>
              <Search
                placeholder="Buscar"
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={departments}
            loading={loading}
            onChange={handleTableChange}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('Filas seleccionadas:', selectedRowKeys, selectedRows);
              },
            }}
            expandable={{
              expandedRowKeys,
              onExpand: handleExpand,
              showExpandColumn: false,
              expandedRowRender: (record) => {
                const subdepts = subdepartmentsData[record.id] || [];
                if (subdepts.length === 0) {
                  return <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>Cargando subdepartamentos...</div>;
                }
                return (
                  <div style={{ padding: '16px', background: '#fafafa' }}>
                    <h4>Subdepartamentos de {record.name}:</h4>
                    <ul>
                      {subdepts.map((subdept) => (
                        <li key={subdept.id}>
                          <strong>{subdept.name}</strong> - 
                          Nivel: {subdept.level}, 
                          Colaboradores: {subdept.employees_count}
                          {subdept.ambassador_name && `, Embajador: ${subdept.ambassador_name}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              },
              rowExpandable: (record) => record.sub_departments_count > 0,
            }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: () => `Total colaboradores: ${totalEmployees}`,
              pageSizeOptions: ['10', '20', '50', '100'],
              position: ['bottomRight'],
            }}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Modal
          title={editingDepartment ? 'Editar Departamento' : 'Crear Nuevo Departamento'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={loading}
          okText={editingDepartment ? 'Actualizar' : 'Crear'}
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nombre del Departamento"
              rules={[
                { required: true, message: 'El nombre es requerido' },
                { max: 45, message: 'Máximo 45 caracteres' },
              ]}
            >
              <Input placeholder="Ej: Marketing" />
            </Form.Item>

            <Form.Item
              name="parent_department_id"
              label="Departamento Superior (Opcional)"
            >
              <Select
                placeholder="Selecciona un departamento superior"
                allowClear
              >
                {departments.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label="Nivel"
              rules={[{ required: true, message: 'El nivel es requerido' }]}
              initialValue={Math.floor(Math.random() * 5) + 1}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="employees_count"
              label="Cantidad de Colaboradores"
              rules={[{ required: true, message: 'La cantidad es requerida' }]}
              initialValue={Math.floor(Math.random() * 20) + 1}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="ambassador_name"
              label="Embajador (Opcional)"
            >
              <Input placeholder="Nombre completo del embajador" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DepartmentsView;
