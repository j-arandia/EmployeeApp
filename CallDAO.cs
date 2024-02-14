using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    public class CallDAO
    {
        readonly IRepository<Calls> repository;
        public CallDAO()
        {
            repository = new HelpdeskRepository<Calls>();
        }

        public Calls GetById(int id)
        {
            try
            {
                return repository.GetByExpression(emp => emp.Id == id).FirstOrDefault();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                throw ex;
            }
        }

        public int Add(Calls newCall)
        {
            try
            {
                newCall = repository.Add(newCall);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                throw ex;
            }

            return newCall.Id;
        }

        public UpdateStatus Update(Calls updatedCall)
        {
            UpdateStatus callUpdated = UpdateStatus.Failed;
            try
            {
                callUpdated = repository.Update(updatedCall);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
            }
            return callUpdated;
        }

        public int Delete(int id)
        {
            int callDeleted = -1;
            try
            {
                callDeleted = repository.Delete(id);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                throw ex;
            }
            return callDeleted;
        }

        public List<Calls> GetAll()
        {
            try
            {
                return repository.GetAll();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                    MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                throw ex;
            }
        }
    }
}
