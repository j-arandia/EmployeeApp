using HelpdeskDAL;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

namespace HelpdeskViewModels
{
    public class EmployeeViewModel
    {
        readonly private EmployeeDAO _dao;
        public int Id { get; set; }
        public string Title { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phoneno { get; set; }
        public string Timer { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public bool? IsTech { get; set; }
        public string StaffPicture64 { get; set; }

        //constructor 
        public EmployeeViewModel()
        {
            _dao = new EmployeeDAO();
        }

        public void GetByLastname()
        {
            try
            {
                Employees emp = _dao.GetByLastname(Lastname);
                Title = emp.Title;
                Firstname = emp.FirstName;
                Lastname = emp.LastName;
                Phoneno = emp.PhoneNo;
                Email = emp.Email;
                Id = emp.Id;
                DepartmentId = emp.DepartmentId;
                IsTech = emp.IsTech ?? false;
                if (emp.StaffPicture != null)
                {
                    StaffPicture64 = Convert.ToBase64String(emp.StaffPicture);
                }
                Timer = Convert.ToBase64String(emp.Timer);
            }
            catch (NullReferenceException nex)
            {
                Debug.WriteLine(nex.Message);
                Lastname = "not found";
            }
            catch (Exception ex)
            {
                Lastname = "not found";
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
        }

        public void GetByEmail()
        {
            try
            {
                Employees emp = _dao.GetByEmail(Email);
                Title = emp.Title;
                Firstname = emp.FirstName;
                Lastname = emp.LastName;
                Phoneno = emp.PhoneNo;
                Email = emp.Email;
                Id = emp.Id;
                DepartmentId = emp.DepartmentId;
                IsTech = emp.IsTech ?? false;
                if (emp.StaffPicture != null)
                {
                    StaffPicture64 = Convert.ToBase64String(emp.StaffPicture);
                }
                Timer = Convert.ToBase64String(emp.Timer);
            }
            catch (NullReferenceException nex)
            {
                Debug.WriteLine(nex.Message);
                Lastname = "not found";
            }
            catch (Exception ex)
            {
                Lastname = "not found";
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
        }

        public void GetById()
        {
            try
            {
                Employees emp = _dao.GetById(Id);
                Title = emp.Title;
                Firstname = emp.FirstName;
                Lastname = emp.LastName;
                Phoneno = emp.PhoneNo;
                Email = emp.Email;
                Id = emp.Id;
                DepartmentId = emp.DepartmentId;
                IsTech = emp.IsTech ?? false;
                if (emp.StaffPicture != null)
                {
                    StaffPicture64 = Convert.ToBase64String(emp.StaffPicture);
                }
                Timer = Convert.ToBase64String(emp.Timer);
            }
            catch (NullReferenceException nex)
            {
                Debug.WriteLine(nex.Message);
                Lastname = "not found";
            }
            catch (Exception ex)
            {
                Lastname = "not found";
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
        }

        public List<EmployeeViewModel> GetAll()
        {
            List<EmployeeViewModel> allVms = new List<EmployeeViewModel>();
            try
            {
                List<Employees> allEmployees = _dao.GetAll();
                foreach (Employees emp in allEmployees)
                {
                    EmployeeViewModel empVm = new EmployeeViewModel();
                    empVm.Title = emp.Title;
                    empVm.Firstname = emp.FirstName;
                    empVm.Lastname = emp.LastName;
                    empVm.Phoneno = emp.PhoneNo;
                    empVm.Email = emp.Email;
                    empVm.Id = emp.Id;
                    empVm.DepartmentId = emp.DepartmentId;
                    empVm.Timer = Convert.ToBase64String(emp.Timer);
                    empVm.IsTech = emp.IsTech ?? false;
                    if (emp.StaffPicture != null)
                    {
                        empVm.StaffPicture64 = Convert.ToBase64String(emp.StaffPicture);
                    }
                    allVms.Add(empVm);
                }
            }

            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
            return allVms;
        }

        public void Add()
        {
            Id = -1;
            try
            {
                Employees emp = new Employees
                {
                    Title = Title,
                    FirstName = Firstname,
                    LastName = Lastname,
                    PhoneNo = Phoneno,
                    Email = Email,
                    DepartmentId = DepartmentId
                   
                };
                Id = _dao.Add(emp);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
        }

        public int Update()
        {
            UpdateStatus employeesUpdated = UpdateStatus.Failed;
            try
            {
                Employees emp = new Employees
                {
                    Title = Title,
                    FirstName = Firstname,
                    LastName = Lastname,
                    PhoneNo = Phoneno,
                    Email = Email,
                    Id = Id,
                    DepartmentId = DepartmentId
                };
                if (StaffPicture64 != null)
                {
                    emp.StaffPicture = Convert.FromBase64String(StaffPicture64);
                }

                emp.Timer = Convert.FromBase64String(Timer);
                employeesUpdated = _dao.Update(emp);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }

            return Convert.ToInt16(employeesUpdated);
        }

        public int Delete()
        {
            int employeesDeleted = -1;
            try
            {
                employeesDeleted = _dao.Delete(Id);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
            return employeesDeleted;
        }

        public List<EmployeeViewModel> GetAllTech()
        {
            List<EmployeeViewModel> allVms = new List<EmployeeViewModel>();
            try
            {
                List<Employees> allEmployees = _dao.GetAll();
                foreach (Employees emp in allEmployees)
                {
                    if(emp.IsTech == true)
                    {
                        EmployeeViewModel empVm = new EmployeeViewModel();
                        empVm.Title = emp.Title;
                        empVm.Firstname = emp.FirstName;
                        empVm.Lastname = emp.LastName;
                        empVm.Phoneno = emp.PhoneNo;
                        empVm.Email = emp.Email;
                        empVm.Id = emp.Id;
                        empVm.DepartmentId = emp.DepartmentId;
                        empVm.Timer = Convert.ToBase64String(emp.Timer);
                        empVm.IsTech = emp.IsTech ?? false;
                        if (emp.StaffPicture != null)
                        {
                            empVm.StaffPicture64 = Convert.ToBase64String(emp.StaffPicture);
                        }
                        allVms.Add(empVm);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
            return allVms;
        }

    }
}
