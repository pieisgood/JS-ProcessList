//ProcessState is the current state of a process
//ProcessState determines how processes are handled
var ProcessState = {
    UNITIALIZED: "UNITIALIZED",
    REMOVED: "REMOVED",
    RUNNING: "RUNNING",
    PAUSED: "PAUSED",
    SUCEEDED: "SUCEEDED",
    FAILED: "FAILED",
    ABORTED: "ABORTED"
};

function Process() {
	"use stric";
	var that = this;
    that.m_state = ProcessState.UNITIALIZED;
    that.m_childProcess = "";

    that.OnInit = function () {
        that.m_state = ProcessState.RUNNING;
    };

    that.OnUpdate = function (msDelta) {
        document.write("processed the data" + msDelta);
        that.m_state = ProcessState.SUCEEDED;
    };

    that.OnSuccess = function () {
        //override this function with specific Process Code
    };

    that.OnFail = function () {
        //override this function with specific Process Code
    };

    that.OnAbort = function () {
        //override this function with specific Process Code
    };

    that.Succeed = function () {
        that.m_state = ProcessState.SUCEEDED;
    };

    that.Fail = function () {
        that.m_state = ProcessState.FAILED;
    };

    that.Pause = function () {
        that.m_state = ProcessState.PAUSED;
    };

    that.UnPause = function () {
        that.m_state = ProcessState.RUNNING;
    };

    that.GetState = function () {
        return that.m_state;
    };

    that.IsAlive = function () {
        return (that.m_state === ProcessState.RUNNING || that.m_state === ProcessState.PAUSED);
    };

    that.IsDead = function () {
        return (that.m_state === ProcessState.SUCEEDED || 
        		that.m_state === ProcessState.FAILED || 
        		that.m_state === ProcessState.ABORTED);
    };

    that.IsRemoved = function () {
        return (that.m_state === ProcessState.REMOVED);
    };

    that.IsPaused = function () {
        return (that.m_state === ProcessState.PAUSED);
    };

    that.AttachChild = function (child) {
        that.m_childProcess = child;
    };

    that.RemoveChild = function () {
        var tempChild = that.m_childProcess;
        that.m_childProcess = "";
        return tempChild;
    };

    that.PeekChild = function () {
        return that.m_childProcess;
    };

    that.SetState = function (state) {
        that.m_state = state;
    };
};

function ProcessList() {
	"use stric";
	var that = this;
    that.m_list = [];

    that.UpdateProcesses = function (msDelta) {

        var count = {
            success: 0,
            fail: 0
        };

        var proc;

        for (var i = 0; i < that.m_list.length; i++) {

        	proc = that.m_list[i];

            if ( proc.GetState() === ProcessState.UNITIALIZED ) {
                proc.OnInit();
            }

            if (proc.GetState() === ProcessState.RUNNING) {
                proc.OnUpdate(msDelta);
            }

            if (proc.IsDead()) {

                switch (proc.GetState()) {

                    case ProcessState.SUCEEDED:
                        proc.OnSuccess();
                        var pChild = proc.RemoveChild();
                        if (pChild) {
                            this.AttachProcess(pChild);
                        } else {
                            count.success = count.success + 1;
                        }

                        break;


                    case ProcessState.FAILED:
                        proc.OnFail();
                        count.fail = count.fail + 1;
                        break;


                    case ProcessState.ABORTED:
                        proc.OnAbort();
                        count.fail = count.fail + 1;
                        break;

                }

            }
        }

        return count;
    };

    that.AttachProcess = function (process) {
        that.m_list.push(process);
    };

    that.AbortAllProcesses = function (immediate) {

        if (immediate) {
            that.m_list = [];
        } else {

            for (var proc in this.m_list) {
                proc.SetState( ProcessState.ABORTED );
            }
        }

    };

    that.GetProcessCount = function () {
        return that.m_list.length;
    };

};
