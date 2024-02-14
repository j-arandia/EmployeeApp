using HelpdeskDAL;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

namespace HelpdeskViewModels
{
    public class CallViewModel
    {
        private CallDAO _dao;
        public int Id { get; set; }
        public int ProblemId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string ProblemDescription { get; set; }
        public string TechName { get; set; }
        public int TechId { get; set; }
        public DateTime DateOpened { get; set; }
        public DateTime? DateClosed { get; set; }
        public bool OpenStatus { get; set; }
        public string Notes { get; set; }
        public string Timer { get; set; }

        public CallViewModel()
        {
            _dao = new CallDAO();
        }

        public List<CallViewModel> GetAll()
        {
            List<CallViewModel> allVms = new List<CallViewModel>();
            try
            {
                List<Calls> allCalls = _dao.GetAll();

                foreach (Calls call in allCalls)
                {
                    CallViewModel cvm = new CallViewModel();
                    cvm.Id = call.Id;
                    cvm.ProblemId = call.ProblemId;
                    cvm.EmployeeId = call.EmployeeId;
                    cvm.EmployeeName = call.Employee.LastName;
                    cvm.ProblemDescription = call.Problem.Description; //lazyloading
                    cvm.TechName = call.Tech.LastName;
                    cvm.TechId = call.TechId;
                    cvm.DateOpened = call.DateOpened;
                    cvm.DateClosed = call.DateClosed;
                    cvm.OpenStatus = call.OpenStatus;
                    cvm.Notes = call.Notes;
                    cvm.Timer = Convert.ToBase64String(call.Timer);
                    allVms.Add(cvm);
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

        public void GetById()
        {
            try
            {
                Calls call = _dao.GetById(Id);
                Id = call.Id;
                ProblemId = call.ProblemId;
                ProblemDescription = call.Problem.Description;
                EmployeeId = call.EmployeeId;
                EmployeeName = call.Employee.LastName;
                TechId = call.TechId;
                TechName = call.Tech.LastName;
                DateOpened = call.DateOpened;
                DateClosed = call.DateClosed;
                OpenStatus = call.OpenStatus;
                Notes = call.Notes;
                Timer = Convert.ToBase64String(call.Timer);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
        }

        public void Add()
        {
            Id = -1;
            try
            {
                Calls call = new Calls
                {
                    EmployeeId = EmployeeId,
                    ProblemId = ProblemId,
                    TechId = TechId,
                    DateOpened = DateOpened,
                    DateClosed = DateClosed,
                    OpenStatus = OpenStatus,
                    Notes = Notes,
                };
               Id = _dao.Add(call);
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
            UpdateStatus callUpdated = UpdateStatus.Failed;
            try
            {
                Calls call = new Calls
                {
                    Id = Id,
                    EmployeeId = EmployeeId,
                    ProblemId = ProblemId,
                    TechId = TechId,
                    DateOpened = DateOpened,
                    DateClosed = DateClosed,
                    OpenStatus = OpenStatus,
                    Notes = Notes
                };
                
                call.Timer = Convert.FromBase64String(Timer);
                callUpdated = _dao.Update(call);
            }
            catch (NullReferenceException nex)
            {
                Debug.WriteLine(nex.Message);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }

            return Convert.ToInt16(callUpdated);
        }

        public int Delete()
        {
            int callDeleted = -1;
            try
            {
                callDeleted = _dao.Delete(Id);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + "  " + ex.Message);
                throw ex;
            }
            return callDeleted;
        }

    }
}
