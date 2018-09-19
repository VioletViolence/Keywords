var data
webix.ajax().get('http://localhost:8080/keywords', function (t, d) {
    data = d.json();
    var counter = 0;
    var list;
    for (var i in data) {
        if(counter <= 5) {
            $$("layout1").addView({
                rows: [
                    {view: "label",css:"bold_text", padding: 5, label: i},
                    {
                        view: "editlist",
                        header: i,
                        select: true,
                        editable: true,
                        editor:"text",
                        editaction:"dblclick",
                        id: i,
                        template:"#keyword#",
                        onContext: {}
                    }
                ]
            }, 2)
            list = data[i]
            for (var keyIndex in list){
                $$(i).add({
                    id: list[keyIndex].id,
                    keyword: list[keyIndex].keyword
                })
            }
            ++counter
        }
        else{
            $$("layout2").addView({
                rows: [
                    {view: "label",css:"bold_text", padding: 5, label: i},
                    {
                        view: "editlist",
                        header: i,
                        select: true,
                        editable: true,
                        editor:"text",
                        editaction: "dblclick",
                        id: i,
                        template:"#keyword#",
                        onContext: {},
                        data: list
                    }
                ]
            }, 2)
        }
        list = data[i]
        for (var keyIndex in list){
            $$(i).add({
                id: list[keyIndex].id,
                keyword: list[keyIndex].keyword
            })
        }
        $$("cmenu").attachTo($$(i));
    }
})
webix.ui({
    type:"space",
    id: "layout",
    responsive:true,
    rows:[
        {   cols:[
                {view:"label",css:"bold_text",label:"Projects Ü",width:150},
                {view:"button",id:"reset",width:350,label:"Reset Selection",click:
                        function(){
                                for (var i in data) {
                                    $$(i).unselectAll()
                                }
                        }
                },
                {view:"button",id:"delete",width:300,label:"Delete Selected",click:
                        function(){
                                for (var i in data) {
                                    var selectedItem = $$(i).getSelectedId()
                                    if(!selectedItem){
                                    }
                                    else{
                                        $$(i).remove(selectedItem)
                                    }
                                    $$(i).refresh()
                                }
                        }
                },
                {view:"text", id:"filterBox", placeholder:"Type Here Your Filter Words",on:
                    {
                        "onKeyPress": function(){
                            var text = $$("filterBox").getValue()
                                for (var i in data) {
                                    $$(i).filter(function (obj) {
                                        return obj.value.toLowerCase().indexOf(text.toLowerCase()) === 0
                                    })
                                }
                        }
                    }
                },
                {view:"button",type:"icon",width:30, icon:"times-circle-o",click:
                        function(){
                            $$("filterBox").setValue("");
                                var text = $$("filterBox").getValue()
                                    for (var i in data) {
                                        $$(i).filter(function (obj) {
                                            return obj.value.toLowerCase().indexOf(text.toLowerCase()) === 0
                                        })
                                    }
                        }
                }
            ]
        },
        {
            id: "layout1",
            responsive:true,
            type: "scrollview",
            scroll: true,
            cols:[

            ]
        },
        {
            id: "layout2",
            responsive:true,
            type: "scrollview",
            scroll: true,
            cols:[

            ]
        }
    ]
});

webix.protoUI({
    name:"editlist"
}, webix.EditAbility, webix.ui.list);
webix.ui({
    view:"contextmenu",
    id:"cmenu",
    data:["Add","Delete","Transfer",{ $template:"Separator" },"Info"],
    on:{
        "onItemClick":function(id){
            switch($$("cmenu").getItem(id).value) {
                case "Add": {
                    var context = this.getContext();
                    var list = context.obj;;
                    var parentObj = list.getParentView();
                    webix.ui({
                        view:"popup",
                        id:"popupAddKey",
                        height:250,
                        width:300,
                        position:"center",
                        body:{
                            rows:[
                                {view:"text", id:"addingBox",width:350, placeholder:"Type Here New Key Name"},
                                {view:"button",id:"addition",width:350,label:"Add&Close",click:
                                    function(){
                                        $$(list).add({
                                            id: $$("addingBox").getValue(),
                                            value:$$("addingBox").getValue()
                                        })
                                        $$(list).refresh()
                                        var addedKey = {
                                            "keyword": $$("addingBox").getValue(),
                                            "category": list.getItemId()
                                        }
                                        console.log(list.getItemId())
                                        fetch("http://localhost:8080/keywords", {
                                            method: "POST", // *GET, POST, PUT, DELETE, etc.
                                            credentials: "same-origin", // include, same-origin, *omit
                                            redirect: "follow", // manual, *follow, error
                                            referrer: "no-referrer", // no-referrer, *client
                                            body: JSON.stringify(addedKey), // body data type must match "Content-Type" header
                                        })
                                        $$("popupAddKey").close()
                                    }

                                }
                            ]
                        }
                    }).show();
                    break;
                }
                case "Delete":{
                    webix.message("Delete")
                    var context = this.getContext();
                    var list = context.obj;
                    var listId = context.id;
                    $$(list).remove(listId)
                    $$(list).refresh()
                    break;
                }
                case "Transfer":{
                    var context = this.getContext();
                    var list = context.obj;
                    webix.ui({
                        view:"popup",
                        id:"popupTransfer",
                        height:250,
                        width:300,
                        position:"center",
                        body:{
                            rows:[
                                {
                                    view:"select",
                                    id:"transferSelect",
                                    width:350,
                                    placeholder:"Column Name",
                                    options:[
                                        {"id":1,"value":"Column One"},
                                        {"id":2,"value":"Column Two"}
                                    ]
                                },
                                {view:"button",id:"transfer",width:350,label:"Transfer&Close",click:
                                        function(){
                                            webix.message("Transfered to "+$$("transferSelect").getValue())
                                        }

                                }
                            ]
                        }
                    }).show();
                    break;
                }
            }
        }
    }
});