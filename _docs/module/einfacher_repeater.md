---
title: "Einfacher Repeater mit Alpine.js"
authors: [eaCe]
prio:
---

# Einfacher Repeater mit Alpine.js

Benötigt man einen einfachen Repeater für. z.B. mehrere Akkordion-Gruppen, lässt sich dieser recht einfach mit Alpine.js umsetzen.
Diese Gruppen beinhalten jeweils eine Überschrift und beliebig viele Feldgruppen mit Titel, Text und Link.
Die Felder können natürlich beliebig erweitert werden.

Der Einfachheit halber liegt sowohl der Script als auch der Style im Modul selbst.
Man kann diese natürlich auch auslagern.

Im Folgenden Beispiel sieht das ganze dann so aus:

![Repeater](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/repeater.png?raw=true "Repeater")


## Eingabe


```php
<script>
    if(typeof Alpine !== 'undefined') {
        /**
         * Wenn Alpinejs bereits verfügbar ist...
         */
        addAlpineDirective();
    }
    else
    {
        document.addEventListener('alpine:init', () => {
            /**
             * Wenn Alpinejs verfügbar ist...
             */
            addAlpineDirective();
        })
    }

    /**
     * Alpinejs directive um pjax/jquery murks zu verhindern...
     */
    function addAlpineDirective() {
        Alpine.directive('repeater', (el) => {
            setTimeout(() => {
                el.dispatchEvent(new CustomEvent('repeater:ready'))
            })
        })
    }

    window.repeater = () =>
    {
        return {
            groups: [],
            value: '',
            initialValue: [],
            $alpineLoader: document.querySelector('.alpine-loader'),
            addGroup(position)
            {
                /**
                 * 0 = top
                 * 1 = bottom
                 */

                /**
                 * Objekt entsprechend der Gruppen-Felddefinitionen
                 */
                const obj = {
                    headline: '',
                    fields: [],
                };

                if(position) {
                    this.groups.push(obj);
                }
                else {
                    this.groups.unshift(obj);
                }
            },
            addFields(index)
            {
                /**
                 * Objekt entsprechend der Felddefinitionen
                 */
                this.groups[index].fields.push({
                    title: '',
                    text: '',
                    link: {
                        id: '',
                        name: '',
                    },
                });
            },
            removeGroup(index)
            {
                this.groups.splice(index, 1);
                this.updateValues();
            },
            removeField(groupIndex, fieldIndex)
            {
                this.groups[groupIndex].fields.splice(fieldIndex, 1);
                this.updateValues();
            },
            updateValues()
            {
                /**
                 * Gruppen werden als String im value-Model gespeichert...
                 */
                this.value = JSON.stringify(this.groups);
            },
            setInitialValue(initialValue)
            {
                /**
                 * Vorhanden Daten setzen...
                 */
                this.initialValue = initialValue;
                this.groups = [];

                if (this.initialValue)
                {
                    this.groups = this.initialValue;
                    this.value = JSON.stringify(this.groups);
                }

                this.$nextTick(() =>
                {
                    this.$alpineLoader.classList.remove('rex-visible');
                });
            },
            moveGroup(from, to) {
                this.groups.splice(to, 0, this.groups.splice(from, 1)[0]);
                this.updateValues();
            },
            moveField(groupIndex, from, to) {
                this.groups[groupIndex].fields.splice(to, 0, this.groups[groupIndex].fields.splice(from, 1)[0]);
                this.updateValues();
            },
            addLink(id, groupIndex, index) {
                let linkMap = openLinkMap(id);
                /**
                 * man kann nur via jQuery auf jQuery events hören...
                 */
                $(linkMap).on('rex:selectLink', (event, linkurl, linktext) => {
                    this.groups[groupIndex].fields[index].link['id'] = linkurl.replace('redaxo://', '');
                    this.groups[groupIndex].fields[index].link['name'] = linktext;
                    this.updateValues();
                });

                return false;
            },
            removeLink(groupIndex, index) {
                this.groups[groupIndex].fields[index].link['id'] = '';
                this.groups[groupIndex].fields[index].link['name'] = '';
                this.updateValues();
            }
        }
    }
</script>

<!-- Nur zu optischen zwecken, wird ausgeblendet sobald die Felder geladen sind -->
<div class="alpine-loader rex-ajax-loader rex-visible"><div class="rex-ajax-loader-elements"><div class="rex-ajax-loader-element1 rex-ajax-loader-element"></div><div class="rex-ajax-loader-element2 rex-ajax-loader-element"></div><div class="rex-ajax-loader-element3 rex-ajax-loader-element"></div><div class="rex-ajax-loader-element4 rex-ajax-loader-element"></div><div class="rex-ajax-loader-element5 rex-ajax-loader-element"></div></div></div>

<section class="repeater">

    <!-- Um Probleme mit jQuery/pjax zu vermeiden wird die Komponente verzögert geladen -->
    <!-- Zum initialisieren wird das gespeicherte Objekt übergeben -->
    <div x-data="repeater()" x-repeater @repeater:ready.once="setInitialValue(REX_VALUE[1])" id="x-repeater">

        <template x-if="groups.length">
            <a href="#" type="button" class="btn btn-primary mb-3" @click.prevent="addGroup(0)"><i class="rex-icon fa-plus-circle"></i> Gruppe hinzufügen</a>
        </template>

        <template x-for="(group, groupIndex) in groups" :key="groupIndex">
            <div class="repeater-group">
                <header class="mb-3 pb-3">
                    <div class="container-fluid p-0">
                        <div class="row">
                            <div class="col-sm-9"><strong>Gruppe</strong></div>
                            <div class="col-sm-3 text-right">

                                <template x-if="groupIndex !== 0">
                                    <a href="#" @click.prevent="moveGroup(groupIndex, groupIndex-1)" class="button move"><i class="rex-icon fa-chevron-up"></i></a>
                                </template>

                                <template x-if="groupIndex+1 < groups.length">
                                    <a href="#" @click.prevent="moveGroup(groupIndex, groupIndex+1)" class="button move"><i class="rex-icon fa-chevron-down"></i></a>
                                </template>

                                <a href="#" @click.prevent="removeGroup(groupIndex)" class="button remove"><i class="rex-icon fa-times"></i></a>
                            </div>
                        </div>
                    </div>
                </header>

                <div>
                    <!-- Felddefinitionen der Gruppe -->
                    <label :for="'group-headline-'+groupIndex">Headline</label>
                    <input type="text"
                           class="form-control mb-3"
                           placeholder="Headline"
                           x-model="group.headline"
                           type="text"
                           name="headline[]"
                           :id="'group-headline-'+groupIndex"
                           x-on:change="updateValues()">

                    <template x-for="(field, index) in group.fields" :key="index">
                        <div class="repeater-group">
                            <header class="mb-3 pb-3">
                                <div class="container-fluid p-0">
                                    <div class="row">
                                        <div class="col-sm-9"><strong>Feldgruppe</strong></div>
                                        <div class="col-sm-3 text-right">

                                            <template x-if="index !== 0">
                                                <a href="#" @click.prevent="moveField(groupIndex, index, index-1)" class="button move"><i class="rex-icon fa-chevron-up"></i></a>
                                            </template>
                                            <template x-if="index+1 < group.fields.length">
                                                <a href="#" @click.prevent="moveField(groupIndex, index, index+1)" class="button move"><i class="rex-icon fa-chevron-down"></i></a>
                                            </template>

                                            <a href="#" @click.prevent="removeField(groupIndex, index)" class="button remove"><i class="rex-icon fa-times"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div>
                                <!-- Felddefinitionen innerhalb der Gruppe -->
                                <label :for="'title-'+groupIndex+'-'+index">Titel</label>
                                <input type="text"
                                       class="form-control mb-3"
                                       placeholder="Titel"
                                       name="title[]"
                                       :id="'title-'+groupIndex+'-'+index"
                                       x-model="field.title"
                                       x-on:change="updateValues()">

                                <label :for="'text-'+groupIndex+'-'+index">Text</label>
                                <textarea class="form-control mb-3"
                                          type="text"
                                          name="text[]"
                                          placeholder="Text"
                                          :id="'text-'+groupIndex+'-'+index"
                                          x-model="field.text"
                                          x-on:change="updateValues()"></textarea>

                                <!-- Beispiel für einen internen Link -->
                                <label :for="'link-'+groupIndex+'-'+index+'_NAME'">Link</label>
                                <div class="input-group">
                                    <input class="form-control"
                                           type="text"
                                           x-model="field.link.name"
                                           :id="'link-'+groupIndex+'-'+index+'_NAME'"
                                           readonly=""
                                           >
                                    <input type="hidden"
                                           name="link[]"
                                           x-model="field.link.id"
                                           :id="'link-'+groupIndex+'-'+index"
                                    >
                                    <span class="input-group-btn">
                                        <a href="#"
                                           class="btn btn-popup"
                                           @click.prevent="addLink('link-'+groupIndex+'-'+index, groupIndex, index)"
                                           title="Link auswählen"><i class="rex-icon rex-icon-open-linkmap"></i>
                                        </a>
                                        <a href="#"
                                           class="btn btn-popup"
                                           @click.prevent="removeLink(groupIndex, index);return false;"
                                           title="Ausgewählten Link löschen"><i class="rex-icon rex-icon-delete-link"></i>
                                        </a>
                                    </span>
                                </div>

                            </div>
                        </div>
                    </template>

                    <a href="#" type="button" class="btn btn-primary" @click.prevent="addFields(groupIndex)"><i class="rex-icon fa-plus-circle"></i> Felder hinzufügen</a>
                </div>
            </div>
        </template>

        <a href="#" type="button" class="btn btn-primary" @click.prevent="addGroup(1)"><i class="rex-icon fa-plus-circle"></i> Gruppe hinzufügen</a>

        <!--  REX_VALUE in der die Daten als JSON gespeichert werden...  -->
        <!--  Daten werden nach blur aktualisiert  -->
        <textarea name="REX_INPUT_VALUE[1]" class="hidden" cols="30" rows="10" x-bind:value="value">REX_VALUE[1]</textarea>
    </div>
</section>


<style>
    section.repeater .repeater-group {
        background-color: #fff;
        padding: 10px;
        border: 1px solid #9ca5b2;
        margin-bottom: 10px;
        transition: background-color 0.3s ease-in-out;
    }

    section.repeater .repeater-group:hover {
        background-color: #f8f8f8;
    }

    section.repeater .repeater-group header {
        border-bottom: 3px solid #e9f5ef;
    }

    section.repeater .repeater-group .button {
        padding: 5px;
        line-height: 1;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        transition: background-color 0.3s ease-in-out;
    }

    section.repeater .repeater-group .button:hover {
        background-color: #dfe3e9;
    }

    section.repeater .repeater-group .button.move {
        color: #3c4d60;
    }

    section.repeater .repeater-group .button.remove {
        color: #d9534f;
    }

    /* utilities... */
    section.repeater .mb-3 {
        margin-bottom: 1rem;
    }

    section.repeater .pb-0 {
        padding-bottom: 0;
    }

    section.repeater .pb-3 {
        padding-bottom: 1rem;
    }
</style>

```

## Ausgabe

```php
<?php
$accordionItems = json_decode(html_entity_decode(REX_VALUE[1]));

foreach ($accordionItems as $accordionItem) {
    echo '<pre>';
    var_dump($accordionItem);
    echo '</pre>';
}
```
