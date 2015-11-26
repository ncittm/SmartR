/**
 * Heatmap View
 */
HeatmapView = (function(){
    var heatmapService, extJSHelper;

    var view = {
        container : jQuery('#heim-tabs'),
        fetchDataView : {
            conceptPathsInput : jQuery('#divIndependentVariable'),
            identifiersInput : jQuery('#heim-input-txt-identifiers'),
            actionBtn : jQuery('#heim-btn-fetch-data'),
            clearBtn : jQuery('#heim-btn-clear'),
            checkStatusBtn : jQuery('#heim-btn-check'),
            getResultBtn : jQuery('#heim-btn-get-output'),
            outputArea : jQuery('#heim-fetch-data-output')
        },
        preprocessView : {
            aggregateProbesChk : jQuery('#chkAggregateProbes'),
            preprocessBtn : jQuery('#heim-btn-preprocess-heatmap')
        },
        runHeatmapView : {
            maxRowInput : jQuery('#txtMaxRow'),
            clusteringOptionsDiv : jQuery('#clusteringOptionsDiv'),
            methodSelect : jQuery('#methodSelect'),
            noClustersDiv : jQuery('#noOfClustersDiv'),
            noMarkersDiv : jQuery('#noOfMarkersDiv'),
            runAnalysisBtn : jQuery('#heim-btn-run-heatmap'),
            downloadFileBtn : jQuery('#heim-btn-download-file')
        }
    };

    /**
     *
     * @param v
     * @returns {{conceptPath: *, identifier: *, resultInstanceId: *}}
     * @private
     */
    var _getFetchDataViewValues = function (v) {
        var _conceptPath = extJSHelper.readConceptVariables(v.conceptPathsInput.attr('id'));
        console.log(v.identifiersInput.val());
        return {
            conceptPath : _conceptPath,
            //identifier : v.identifiersInput.val(), // TODO convert to array
            identifier : 'TP53', // TODO convert to array
            resultInstanceId : GLOBAL.CurrentSubsetIDs[1]
        };
    };

    var _getRunHeatmapViewValues = function (v) {
        // get max_rows
        var _maxRows = v.maxRowInput.val();
        console.log(_maxRows);
        return {
            max_rows : _maxRows
        }
    };

    var _getPreprocessViewValues = function (v) {
        // get max_rows
        var _aggregate = v.aggregateProbesChk.is(":checked");
        return {
            aggregate : _aggregate
        }
    };

    /**
     * Fetch data
     * @param eventObj
     * @private
     */
    var _fetchDataAction = function (eventObj) {
        var _fetchDataParams =  _getFetchDataViewValues(view.fetchDataView);
        heatmapService.fetchData(_fetchDataParams);
    };

    var _runHeatmapAction = function (eventObj) {
        var _runHeatmapInputArgs =  _getRunHeatmapViewValues(view.runHeatmapView);
        console.log('_runHeatmapAction', _runHeatmapInputArgs);
        jQuery('#heatmap').empty();
        heatmapService.runAnalysis(_runHeatmapInputArgs);
    };

    var _preprocessAction = function (eventObj) {
        var _preprocessInputArgs =  _getPreprocessViewValues(view.preprocessView);
        console.log('_preprocessAction', _preprocessInputArgs);
        heatmapService.preprocess(_preprocessInputArgs);
    }

    /**
     * Register event handlers
     * @private
     */
    var _registerEventHandlers = function () {

        // init tabs
        view.container.tabs();

        // fetch data btn
        view.fetchDataView.actionBtn.click(
            view.fetchDataView,
            _fetchDataAction
        );

        // register preprocess btn action
        view.preprocessView.preprocessBtn.click(
            view.preprocessView,
            _preprocessAction
        );

        // on change handler
        view.runHeatmapView.methodSelect.on('change', function() {
            if( !(this.value === 'none') ){
                view.runHeatmapView.clusteringOptionsDiv.show();
                view.runHeatmapView.noMarkersDiv.hide();
                view.runHeatmapView.noClustersDiv.hide();
                if(this.value === 'marker-selection'){
                    view.runHeatmapView.noMarkersDiv.show();
                }
                else if(this.value === 'k-means-clustering'){
                    view.runHeatmapView.noClustersDiv.show();
                }
            } else {
                view.runHeatmapView.clusteringOptionsDiv.hide();
            }
        });

        // identifiers autocomplete
        view.fetchDataView.identifiersInput.autocomplete({
            source: heatmapService.getIndentifierSuggestions,
            minLength: 2
        });
        view.fetchDataView.clearBtn.click(view.clearConceptPathInput);

        // TODO Remove this, it's unused
        view.fetchDataView.checkStatusBtn.click(heatmapService.checkStatus);

        view.runHeatmapView.runAnalysisBtn.click (
            view.runHeatmapView,
            _runHeatmapAction
        );
        view.runHeatmapView.downloadFileBtn.click (heatmapService.checkStatus);
    };

    view.clearConceptPathInput = function (eventObj) {
        //console.log('   clear ..')
        extJSHelper.clear(view.fetchDataView.conceptPathsInput);
    };

    /**
     * Initialize helper
     * @param service
     * @param helper
     */
    view.init = function (service, helper) {
        // instantiate tooltips
        jQuery( "[title]" ).tooltip({track: true, tooltipClass:"sr-ui-tooltip"});
        // injects dependencies
        heatmapService = service;
        extJSHelper = helper;
        // register dropzone
        extJSHelper.registerDropzone(view.fetchDataView.conceptPathsInput);
        // register event handles
        _registerEventHandlers();
        // init analysis
        heatmapService.initialize();
    };

    return view;
})();

HeatmapView.init(HeatmapService, HeimExtJSHelper);
